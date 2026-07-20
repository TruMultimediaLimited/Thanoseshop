-- =========================================================================
-- profiles
-- =========================================================================
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Defense in depth: even though the customer-facing profile-edit server
-- action never sends role/admin_role/is_active, block it at the DB level
-- too so a non-admin can never self-escalate via a direct table update.
create or replace function public.prevent_self_privilege_escalation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Deliberately NOT security definer: current_user inside a security
  -- definer function resolves to the function's *owner*, not the caller,
  -- which would make the role check below always false. Running as invoker
  -- keeps current_user meaningful; is_admin() is separately security
  -- definer, so it still works regardless of who's calling this trigger.
  --
  -- Only gate writes coming through PostgREST (the `anon`/`authenticated`
  -- roles). Direct SQL — the Supabase SQL editor, migrations, or the
  -- service-role client — always runs as `postgres`/`service_role` and must
  -- stay able to promote the first admin (see README bootstrap step); it
  -- never has an auth.uid() to satisfy is_admin() against anyway.
  if current_user in ('anon', 'authenticated') and not public.is_admin() then
    if new.role is distinct from old.role
       or new.admin_role is distinct from old.admin_role
       or new.is_active is distinct from old.is_active then
      raise exception 'Only an admin can change role, admin_role, or is_active';
    end if;
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_self_privilege_escalation
  before update on public.profiles
  for each row execute function public.prevent_self_privilege_escalation();

-- =========================================================================
-- Public catalog: published rows readable by everyone, writes admin-only.
-- =========================================================================
alter table public.regions enable row level security;
create policy "regions_select" on public.regions for select using (is_active = true or public.is_admin());
create policy "regions_write" on public.regions for all using (public.is_admin()) with check (public.is_admin());

alter table public.categories enable row level security;
create policy "categories_select" on public.categories for select using (is_published = true or public.is_admin());
create policy "categories_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

alter table public.games enable row level security;
create policy "games_select" on public.games for select using (is_published = true or public.is_admin());
create policy "games_write" on public.games for all using (public.is_admin()) with check (public.is_admin());

alter table public.products enable row level security;
create policy "products_select" on public.products for select using (is_published = true or public.is_admin());
create policy "products_write" on public.products for all using (public.is_admin()) with check (public.is_admin());

alter table public.product_variants enable row level security;
create policy "product_variants_select" on public.product_variants for select using (is_published = true or public.is_admin());
create policy "product_variants_write" on public.product_variants for all using (public.is_admin()) with check (public.is_admin());

alter table public.payment_methods enable row level security;
create policy "payment_methods_select" on public.payment_methods for select using (is_active = true or public.is_admin());
create policy "payment_methods_write" on public.payment_methods for all using (public.is_admin()) with check (public.is_admin());

alter table public.banners enable row level security;
create policy "banners_select" on public.banners for select using (is_active = true or public.is_admin());
create policy "banners_write" on public.banners for all using (public.is_admin()) with check (public.is_admin());

alter table public.homepage_sections enable row level security;
create policy "homepage_sections_select" on public.homepage_sections for select using (is_active = true or public.is_admin());
create policy "homepage_sections_write" on public.homepage_sections for all using (public.is_admin()) with check (public.is_admin());

alter table public.faqs enable row level security;
create policy "faqs_select" on public.faqs for select using (is_published = true or public.is_admin());
create policy "faqs_write" on public.faqs for all using (public.is_admin()) with check (public.is_admin());

alter table public.blog_posts enable row level security;
create policy "blog_posts_select" on public.blog_posts for select using (status = 'published' or public.is_admin());
create policy "blog_posts_write" on public.blog_posts for all using (public.is_admin()) with check (public.is_admin());

alter table public.media enable row level security;
create policy "media_select" on public.media for select using (true);
create policy "media_write" on public.media for all using (public.is_admin()) with check (public.is_admin());

alter table public.site_settings enable row level security;
create policy "site_settings_select" on public.site_settings for select using (true);
create policy "site_settings_update" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());

alter table public.seo_settings enable row level security;
create policy "seo_settings_select" on public.seo_settings for select using (true);
create policy "seo_settings_write" on public.seo_settings for all using (public.is_admin()) with check (public.is_admin());

-- =========================================================================
-- Cart: fully owner-scoped (+ admin read for support purposes).
-- =========================================================================
alter table public.carts enable row level security;
create policy "carts_select" on public.carts for select using (user_id = auth.uid() or public.is_admin());
create policy "carts_insert" on public.carts for insert with check (user_id = auth.uid());
create policy "carts_update" on public.carts for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "carts_delete" on public.carts for delete using (user_id = auth.uid());

alter table public.cart_items enable row level security;
create policy "cart_items_select"
  on public.cart_items for select
  using (
    public.is_admin()
    or cart_id in (select id from public.carts where user_id = auth.uid())
  );
create policy "cart_items_insert"
  on public.cart_items for insert
  with check (cart_id in (select id from public.carts where user_id = auth.uid()));
create policy "cart_items_update"
  on public.cart_items for update
  using (cart_id in (select id from public.carts where user_id = auth.uid()))
  with check (cart_id in (select id from public.carts where user_id = auth.uid()));
create policy "cart_items_delete"
  on public.cart_items for delete
  using (cart_id in (select id from public.carts where user_id = auth.uid()));

-- =========================================================================
-- Coupons: never directly readable by customers (validate_coupon() RPC is
-- the only sanctioned way to check one). coupon_usages is owner-read only.
-- =========================================================================
alter table public.coupons enable row level security;
create policy "coupons_admin_only" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

alter table public.coupon_usages enable row level security;
create policy "coupon_usages_select" on public.coupon_usages for select using (user_id = auth.uid() or public.is_admin());

-- =========================================================================
-- Orders / order_items / payment_submissions: customers can only read their
-- own; all writes after creation are admin-only. Creation itself only ever
-- happens through the place_order() SECURITY DEFINER function, so there are
-- deliberately no customer INSERT policies here.
-- =========================================================================
alter table public.orders enable row level security;
create policy "orders_select" on public.orders for select using (user_id = auth.uid() or public.is_admin());
create policy "orders_update_admin" on public.orders for update using (public.is_admin()) with check (public.is_admin());

alter table public.order_items enable row level security;
create policy "order_items_select"
  on public.order_items for select
  using (
    public.is_admin()
    or order_id in (select id from public.orders where user_id = auth.uid())
  );
create policy "order_items_update_admin" on public.order_items for update using (public.is_admin()) with check (public.is_admin());

alter table public.payment_submissions enable row level security;
create policy "payment_submissions_select"
  on public.payment_submissions for select
  using (
    public.is_admin()
    or order_id in (select id from public.orders where user_id = auth.uid())
  );
create policy "payment_submissions_update_admin" on public.payment_submissions for update using (public.is_admin()) with check (public.is_admin());

-- =========================================================================
-- Reviews: public sees approved; owner always sees their own; admin
-- moderates. Wishlists: fully owner-scoped.
-- =========================================================================
alter table public.reviews enable row level security;
create policy "reviews_select"
  on public.reviews for select
  using (status = 'approved' or user_id = auth.uid() or public.is_admin());
create policy "reviews_insert" on public.reviews for insert with check (user_id = auth.uid());
create policy "reviews_update_admin" on public.reviews for update using (public.is_admin()) with check (public.is_admin());
create policy "reviews_delete_admin" on public.reviews for delete using (public.is_admin());

alter table public.wishlists enable row level security;
create policy "wishlists_select" on public.wishlists for select using (user_id = auth.uid() or public.is_admin());
create policy "wishlists_insert" on public.wishlists for insert with check (user_id = auth.uid());
create policy "wishlists_delete" on public.wishlists for delete using (user_id = auth.uid());

-- =========================================================================
-- Notifications: user sees their own; admin sees/manages everything
-- (including broadcast rows where user_id is null).
-- =========================================================================
alter table public.notifications enable row level security;
create policy "notifications_select"
  on public.notifications for select
  using (user_id = auth.uid() or public.is_admin());
create policy "notifications_update_own_or_admin"
  on public.notifications for update
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy "notifications_write_admin" on public.notifications for insert with check (public.is_admin());
create policy "notifications_delete_admin" on public.notifications for delete using (public.is_admin());

-- =========================================================================
-- Audit logs: append-only, admin-read.
-- =========================================================================
alter table public.audit_logs enable row level security;
create policy "audit_logs_select_admin" on public.audit_logs for select using (public.is_admin());
create policy "audit_logs_insert" on public.audit_logs for insert with check (public.is_admin() or actor_id = auth.uid());
