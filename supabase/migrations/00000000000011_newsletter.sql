-- Backs the homepage "Newsletter" section. Deliberately minimal: just an
-- email capture list for admins to export/use with an email tool later, not
-- a full campaign system.
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_subscribers_insert_anyone"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "newsletter_subscribers_select_admin"
  on public.newsletter_subscribers for select
  using (public.is_admin());

create policy "newsletter_subscribers_delete_admin"
  on public.newsletter_subscribers for delete
  using (public.is_admin());
