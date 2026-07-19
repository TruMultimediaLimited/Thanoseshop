-- Regions: e.g. Free Fire (Bangladesh/CIS/MENA), Mobile Legends (Global/Indonesia/...).
create table public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  flag_icon_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger regions_set_updated_at
  before update on public.regions
  for each row execute function public.set_updated_at();

-- Categories: self-referencing so "sub categories" are just categories with a parent.
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references public.categories (id) on delete set null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_parent_id_idx on public.categories (parent_id);

create trigger categories_set_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- Games
create table public.games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories (id) on delete set null,
  logo_url text,
  banner_url text,
  description text,
  publisher text,
  is_published boolean not null default true,
  is_trending boolean not null default false,
  is_popular boolean not null default false,
  sort_order int not null default 0,
  meta_title text,
  meta_description text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index games_category_id_idx on public.games (category_id);

create trigger games_set_updated_at
  before update on public.games
  for each row execute function public.set_updated_at();

-- Products: the core catalog entity. product_type discriminates top-ups,
-- gift cards, subscriptions, and game accounts, so every "kind" of listing
-- (Free Fire Diamonds, Netflix subscription, Steam Wallet gift card, ...) is
-- a row here rather than a separate table per concept. A product may
-- optionally belong to a game and/or be scoped to one region (e.g. "Free
-- Fire (Bangladesh) Diamonds" vs "Free Fire (MENA) Diamonds" are two
-- products, each with their own denomination variants).
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  product_type public.product_type not null,
  game_id uuid references public.games (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  region_id uuid references public.regions (id) on delete set null,
  description text,
  short_description text,
  thumbnail_url text,
  gallery jsonb not null default '[]'::jsonb,
  base_price numeric(12, 2),
  has_variants boolean not null default false,
  delivery_type public.delivery_type not null default 'manual_topup',
  delivery_instructions text,
  requires_player_id boolean not null default false,
  stock_quantity int,
  is_published boolean not null default true,
  is_featured boolean not null default false,
  is_trending boolean not null default false,
  is_best_seller boolean not null default false,
  meta_title text,
  meta_description text,
  sort_order int not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint base_price_or_variants check (
    has_variants = true or base_price is not null
  )
);

create index products_game_id_idx on public.products (game_id);
create index products_category_id_idx on public.products (category_id);
create index products_region_id_idx on public.products (region_id);
create index products_type_published_idx on public.products (product_type, is_published);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Product variants: denominations / pricing tiers (e.g. "60 UC", "$10 Steam
-- Wallet", "1 Month Netflix Premium"). Simple single-price products (most
-- accounts, flat-rate gift cards) skip this table entirely and use
-- products.base_price instead.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  price numeric(12, 2) not null,
  compare_at_price numeric(12, 2),
  sku text,
  stock_quantity int,
  is_published boolean not null default true,
  sort_order int not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_variants_product_id_idx on public.product_variants (product_id);

create trigger product_variants_set_updated_at
  before update on public.product_variants
  for each row execute function public.set_updated_at();
