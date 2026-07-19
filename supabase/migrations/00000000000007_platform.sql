-- Reusable asset library so admins can pick a previously uploaded image
-- instead of re-uploading across products/games/banners/blog posts.
create table public.media (
  id uuid primary key default gen_random_uuid(),
  file_url text not null,
  file_type text not null,
  file_name text not null,
  file_size int,
  alt_text text,
  folder text,
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index media_folder_idx on public.media (folder);

-- Singleton row: site branding, contact info, SEO defaults.
create table public.site_settings (
  id int primary key default 1,
  site_name text not null default 'Thanos E-Shop',
  logo_url text,
  favicon_url text,
  contact_email text,
  contact_phone text,
  whatsapp_number text,
  facebook_url text,
  footer_text text,
  default_meta_title text,
  default_meta_description text,
  updated_at timestamptz not null default now(),

  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Per-page SEO overrides for static pages that have no dedicated table row
-- (home, about, contact, gift-cards index, ...).
create table public.seo_settings (
  id uuid primary key default gen_random_uuid(),
  page_key text not null unique,
  meta_title text,
  meta_description text,
  og_image_url text,
  canonical_url text,
  updated_at timestamptz not null default now()
);

create trigger seo_settings_set_updated_at
  before update on public.seo_settings
  for each row execute function public.set_updated_at();

-- user_id null = broadcast/admin-facing notification (e.g. "new order",
-- "payment submitted"); set = a customer-facing notification.
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  message text,
  link_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_read_idx on public.notifications (user_id, is_read);

-- Append-only trail backing both the admin "Activity Logs" and "Audit Logs"
-- screens (same table, filtered differently in the UI).
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles (id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);
create index audit_logs_actor_idx on public.audit_logs (actor_id);
