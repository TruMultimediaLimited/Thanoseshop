create sequence public.order_number_seq;

-- Validates a coupon against an order total and the product types in the
-- cart. SECURITY DEFINER because customers have no direct SELECT policy on
-- `coupons` (codes/limits shouldn't be enumerable) — this is the only way
-- they're allowed to check one, and only for their own auth.uid().
create or replace function public.validate_coupon(
  p_code text,
  p_order_total numeric,
  p_product_types public.product_type[]
)
returns table (coupon_id uuid, discount_amount numeric)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_coupon public.coupons%rowtype;
  v_user_id uuid := auth.uid();
  v_usage_count int;
  v_discount numeric;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select * into v_coupon
  from public.coupons
  where code = p_code and deleted_at is null;

  if not found then
    raise exception 'Invalid coupon code';
  end if;

  if not v_coupon.is_active then
    raise exception 'This coupon is no longer active';
  end if;

  if v_coupon.starts_at is not null and now() < v_coupon.starts_at then
    raise exception 'This coupon is not active yet';
  end if;

  if v_coupon.expires_at is not null and now() > v_coupon.expires_at then
    raise exception 'This coupon has expired';
  end if;

  if p_order_total < v_coupon.min_order_amount then
    raise exception 'Order total does not meet the coupon minimum of %', v_coupon.min_order_amount;
  end if;

  if v_coupon.max_uses is not null and v_coupon.used_count >= v_coupon.max_uses then
    raise exception 'This coupon has reached its usage limit';
  end if;

  if v_coupon.max_uses_per_user is not null then
    select count(*) into v_usage_count
    from public.coupon_usages
    where coupon_id = v_coupon.id and user_id = v_user_id;

    if v_usage_count >= v_coupon.max_uses_per_user then
      raise exception 'You have already used this coupon the maximum number of times';
    end if;
  end if;

  if v_coupon.applies_to_product_type is not null
     and not (v_coupon.applies_to_product_type && p_product_types) then
    raise exception 'This coupon does not apply to the items in your cart';
  end if;

  if v_coupon.discount_type = 'percent' then
    v_discount := round(p_order_total * v_coupon.discount_value / 100, 2);
  else
    v_discount := v_coupon.discount_value;
  end if;

  v_discount := least(v_discount, p_order_total);

  return query select v_coupon.id, v_discount;
end;
$$;

-- Atomically turns the caller's cart into an order + payment submission:
-- snapshots prices, decrements stock, records coupon usage, clears the cart.
-- SECURITY DEFINER because the stock decrement touches product_variants /
-- products, which customers have no direct UPDATE access to (admin-write
-- only) — this function is the single, tightly-scoped exception, and it
-- always derives the customer from auth.uid(), never from a parameter.
create or replace function public.place_order(
  p_payment_method_id uuid,
  p_transaction_id text,
  p_screenshot_path text,
  p_amount_claimed numeric,
  p_coupon_code text default null
)
returns table (order_id uuid, order_number text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_cart_id uuid;
  v_subtotal numeric := 0;
  v_discount numeric := 0;
  v_total numeric;
  v_coupon_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_product_types public.product_type[];
  v_item record;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select id into v_cart_id from public.carts where user_id = v_user_id;
  if v_cart_id is null or not exists (
    select 1 from public.cart_items where cart_id = v_cart_id
  ) then
    raise exception 'Cart is empty';
  end if;

  select coalesce(sum(ci.quantity * coalesce(pv.price, p.base_price)), 0),
         array_agg(distinct p.product_type)
    into v_subtotal, v_product_types
  from public.cart_items ci
  join public.products p on p.id = ci.product_id
  left join public.product_variants pv on pv.id = ci.variant_id
  where ci.cart_id = v_cart_id;

  if p_coupon_code is not null then
    select vc.coupon_id, vc.discount_amount
      into v_coupon_id, v_discount
    from public.validate_coupon(p_coupon_code, v_subtotal, v_product_types) vc;
  end if;

  v_total := greatest(v_subtotal - coalesce(v_discount, 0), 0);
  v_order_number := 'THN-' || to_char(now(), 'YYYYMMDD') || '-'
    || lpad(nextval('public.order_number_seq')::text, 5, '0');

  insert into public.orders (
    order_number, user_id, status, subtotal, discount_amount, total,
    coupon_id, payment_method_id
  ) values (
    v_order_number, v_user_id, 'payment_review', v_subtotal, coalesce(v_discount, 0),
    v_total, v_coupon_id, p_payment_method_id
  )
  returning id into v_order_id;

  for v_item in
    select
      ci.product_id, ci.variant_id, ci.quantity, ci.player_id_note,
      p.name as product_name, pv.name as variant_name, r.name as region_name,
      coalesce(pv.price, p.base_price) as unit_price,
      p.stock_quantity as product_stock, pv.stock_quantity as variant_stock
    from public.cart_items ci
    join public.products p on p.id = ci.product_id
    left join public.product_variants pv on pv.id = ci.variant_id
    left join public.regions r on r.id = p.region_id
    where ci.cart_id = v_cart_id
  loop
    if v_item.variant_id is not null then
      if v_item.variant_stock is not null then
        if v_item.variant_stock < v_item.quantity then
          raise exception 'Insufficient stock for %', v_item.variant_name;
        end if;
        update public.product_variants
          set stock_quantity = stock_quantity - v_item.quantity
          where id = v_item.variant_id;
      end if;
    else
      if v_item.product_stock is not null then
        if v_item.product_stock < v_item.quantity then
          raise exception 'Insufficient stock for %', v_item.product_name;
        end if;
        update public.products
          set stock_quantity = stock_quantity - v_item.quantity
          where id = v_item.product_id;
      end if;
    end if;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name_snapshot, variant_name_snapshot,
      region_name_snapshot, unit_price, quantity, line_total, player_id_note
    ) values (
      v_order_id, v_item.product_id, v_item.variant_id, v_item.product_name, v_item.variant_name,
      v_item.region_name, v_item.unit_price, v_item.quantity,
      v_item.unit_price * v_item.quantity, v_item.player_id_note
    );
  end loop;

  insert into public.payment_submissions (
    order_id, transaction_id, screenshot_path, amount_claimed, status
  ) values (
    v_order_id, p_transaction_id, p_screenshot_path, p_amount_claimed, 'pending'
  );

  if v_coupon_id is not null then
    insert into public.coupon_usages (coupon_id, user_id, order_id, discount_amount)
    values (v_coupon_id, v_user_id, v_order_id, v_discount);

    update public.coupons set used_count = used_count + 1 where id = v_coupon_id;
  end if;

  delete from public.cart_items where cart_id = v_cart_id;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    v_user_id, 'order.placed', 'order', v_order_id,
    jsonb_build_object('order_number', v_order_number, 'total', v_total)
  );

  return query select v_order_id, v_order_number;
end;
$$;
