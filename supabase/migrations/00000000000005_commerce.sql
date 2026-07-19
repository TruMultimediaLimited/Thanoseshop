-- Admin-configurable payment methods (bKash/Nagad/Rocket/Bank today; a real
-- gateway can be added later as a new `type` value without a redesign).
create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.payment_method_type not null,
  account_number text,
  account_name text,
  bank_name text,
  branch text,
  routing_number text,
  instructions text,
  logo_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger payment_methods_set_updated_at
  before update on public.payment_methods
  for each row execute function public.set_updated_at();

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type public.discount_type not null,
  discount_value numeric(12, 2) not null,
  min_order_amount numeric(12, 2) not null default 0,
  max_uses int,
  max_uses_per_user int,
  used_count int not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  applies_to_product_type public.product_type[],
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger coupons_set_updated_at
  before update on public.coupons
  for each row execute function public.set_updated_at();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid not null references public.profiles (id),
  status public.order_status not null default 'pending',
  subtotal numeric(12, 2) not null,
  discount_amount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null,
  coupon_id uuid references public.coupons (id),
  payment_method_id uuid references public.payment_methods (id),
  customer_note text,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_status_idx on public.orders (user_id, status);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id),
  variant_id uuid references public.product_variants (id),
  -- Denormalized snapshots so later catalog edits never rewrite order history.
  product_name_snapshot text not null,
  variant_name_snapshot text,
  region_name_snapshot text,
  unit_price numeric(12, 2) not null,
  quantity int not null check (quantity > 0),
  line_total numeric(12, 2) not null,
  player_id_note text,
  -- Filled in by an admin on fulfillment (code/account credentials). Only
  -- ever rendered to the customer once orders.status = 'completed'.
  delivered_payload text,
  delivered_at timestamptz
);

create index order_items_order_id_idx on public.order_items (order_id);

create table public.coupon_usages (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  order_id uuid not null references public.orders (id) on delete cascade,
  discount_amount numeric(12, 2) not null,
  used_at timestamptz not null default now(),

  unique (coupon_id, order_id)
);

create index coupon_usages_coupon_user_idx on public.coupon_usages (coupon_id, user_id);

create table public.payment_submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders (id) on delete cascade,
  transaction_id text not null,
  screenshot_path text not null,
  amount_claimed numeric(12, 2),
  status public.payment_submission_status not null default 'pending',
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now()
);

create index payment_submissions_status_idx on public.payment_submissions (status);
