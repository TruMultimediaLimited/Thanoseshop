-- Module 2 spec deltas: order timeline/notes, announcements, static pages,
-- product gallery, product sale price.

-- ============================================================
-- Order events: one table for both the status timeline and
-- admin-internal notes (event_type discriminator).
-- ============================================================
create type public.order_event_type as enum ('status_change', 'note');

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  event_type public.order_event_type not null,
  from_status public.order_status,
  to_status public.order_status,
  note text,
  actor_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index order_events_order_created_idx
  on public.order_events (order_id, created_at);

-- Every status transition already flows through an UPDATE on orders (admin
-- actions) or the initial INSERT (place_order RPC), so a trigger captures
-- the complete timeline with no application-code changes. SECURITY DEFINER
-- lets customer-initiated transitions write the log row despite the
-- admin-only insert policy below; auth.uid() is JWT-based and is NOT
-- affected by the definer context (unlike current_user).
create or replace function public.log_order_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.order_events (order_id, event_type, from_status, to_status, actor_id)
    values (new.id, 'status_change', null, new.status, auth.uid());
  elsif new.status is distinct from old.status then
    insert into public.order_events (order_id, event_type, from_status, to_status, actor_id)
    values (new.id, 'status_change', old.status, new.status, auth.uid());
  end if;
  return new;
end;
$$;

create trigger orders_log_status_change
  after insert or update on public.orders
  for each row execute function public.log_order_status_change();

alter table public.order_events enable row level security;

-- Customers may see the status timeline of their own orders; notes are
-- admin-internal and never visible to customers.
create policy "order_events_select" on public.order_events for select using (
  public.is_admin()
  or (
    event_type = 'status_change'
    and order_id in (select id from public.orders where user_id = auth.uid())
  )
);
create policy "order_events_insert" on public.order_events
  for insert with check (public.is_admin());

-- ============================================================
-- Announcements (site-wide top bar messages)
-- ============================================================
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  link_url text,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger announcements_set_updated_at
  before update on public.announcements
  for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;

create policy "announcements_select" on public.announcements for select using (
  public.is_admin()
  or (
    is_active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  )
);
create policy "announcements_write" on public.announcements
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Static pages (admin-managed CMS pages served at /pages/[slug])
-- ============================================================
create table public.static_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text not null default '',
  meta_title text,
  meta_description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger static_pages_set_updated_at
  before update on public.static_pages
  for each row execute function public.set_updated_at();

alter table public.static_pages enable row level security;

create policy "static_pages_select" on public.static_pages for select using (
  (is_published = true and deleted_at is null) or public.is_admin()
);
create policy "static_pages_write" on public.static_pages
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- Sale price for non-variant products (variants already carry
-- their own compare_at_price). Gallery images intentionally use
-- the existing products.gallery jsonb column — no new table.
-- ============================================================
alter table public.products add column compare_at_price numeric(12, 2);
