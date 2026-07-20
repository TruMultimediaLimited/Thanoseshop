-- One active cart per user (DB-backed, not localStorage — see README/plan for
-- rationale: login-required checkout, server-authoritative totals).
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger carts_set_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  player_id_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cart_items_cart_id_idx on public.cart_items (cart_id);

-- Postgres treats every NULL as distinct, so a plain UNIQUE(cart_id,
-- product_id, variant_id) would let variant-less products be added twice
-- instead of merging quantity. Two partial indexes cover both cases.
create unique index cart_items_with_variant_uidx
  on public.cart_items (cart_id, product_id, variant_id)
  where variant_id is not null;

create unique index cart_items_without_variant_uidx
  on public.cart_items (cart_id, product_id)
  where variant_id is null;

create trigger cart_items_set_updated_at
  before update on public.cart_items
  for each row execute function public.set_updated_at();
