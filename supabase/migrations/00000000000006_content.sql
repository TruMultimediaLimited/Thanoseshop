create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  -- Ties a review to a verified purchase for a "verified buyer" badge.
  order_item_id uuid references public.order_items (id),
  rating int not null check (rating between 1 and 5),
  comment text,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index reviews_product_status_idx on public.reviews (product_id, status);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),

  unique (user_id, product_id)
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  -- null = general/site-wide FAQ; set = shown on that product's page too.
  product_id uuid references public.products (id) on delete cascade,
  sort_order int not null default 0,
  is_published boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_product_id_idx on public.faqs (product_id);

create trigger faqs_set_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

create table public.banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image_url text not null,
  mobile_image_url text,
  link_url text,
  placement public.banner_placement not null default 'hero',
  sort_order int not null default 0,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index banners_placement_idx on public.banners (placement, is_active);

create trigger banners_set_updated_at
  before update on public.banners
  for each row execute function public.set_updated_at();

-- Ordered, admin-configurable homepage blocks. The homepage template just
-- iterates this table by sort_order and dispatches on section_type — no
-- homepage layout changes ever require a code deploy.
create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_type public.homepage_section_type not null,
  title text,
  subtitle text,
  config jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger homepage_sections_set_updated_at
  before update on public.homepage_sections
  for each row execute function public.set_updated_at();

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  author_id uuid references public.profiles (id),
  status public.blog_status not null default 'draft',
  published_at timestamptz,
  meta_title text,
  meta_description text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_published_idx on public.blog_posts (status, published_at);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();
