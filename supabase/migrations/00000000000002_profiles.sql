-- profiles: one row per auth.users row, extends identity with app-level fields.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role public.user_role not null default 'customer',
  -- Only meaningful when role = 'admin'. A fixed set of named roles (not a
  -- custom permission builder) — enforced at the server-action/UI layer.
  -- RLS itself only distinguishes customer vs admin (see is_admin()).
  admin_role public.admin_role,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint admin_role_requires_admin check (
    admin_role is null or role = 'admin'
  )
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-provision a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Security-definer helpers used throughout RLS policies. Kept minimal and
-- read-only to limit the privilege-escalation surface of `security definer`.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and is_active = true
  );
$$;

create or replace function public.current_admin_role()
returns public.admin_role
language sql
stable
security definer set search_path = public
as $$
  select admin_role from public.profiles
  where id = auth.uid() and role = 'admin' and is_active = true;
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select public.current_admin_role() = 'super_admin';
$$;
