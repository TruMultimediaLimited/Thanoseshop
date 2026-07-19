-- Public bucket for product/game/category/banner/blog images and site
-- branding assets. Private bucket for customer-submitted payment proof.
insert into storage.buckets (id, name, public)
values
  ('public-assets', 'public-assets', true),
  ('payment-screenshots', 'payment-screenshots', false)
on conflict (id) do nothing;

-- public-assets: anyone can view, only admins can manage.
create policy "public_assets_read"
  on storage.objects for select
  using (bucket_id = 'public-assets');

create policy "public_assets_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'public-assets' and public.is_admin());

create policy "public_assets_admin_update"
  on storage.objects for update
  using (bucket_id = 'public-assets' and public.is_admin())
  with check (bucket_id = 'public-assets' and public.is_admin());

create policy "public_assets_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'public-assets' and public.is_admin());

-- payment-screenshots: private. Path convention is {user_id}/{order_ref}/...
-- so a customer can only touch objects under their own uid folder; admins
-- can read everything (via signed URLs generated server-side) to review
-- proof of payment, but never write into a customer's folder.
create policy "payment_screenshots_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'payment-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "payment_screenshots_read"
  on storage.objects for select
  using (
    bucket_id = 'payment-screenshots'
    and (
      public.is_admin()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

create policy "payment_screenshots_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'payment-screenshots'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
