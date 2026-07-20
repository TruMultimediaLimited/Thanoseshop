-- Extensions
create extension if not exists pgcrypto with schema extensions;

-- Enums
create type public.user_role as enum ('customer', 'admin');
create type public.admin_role as enum ('super_admin', 'order_manager', 'product_manager', 'support');
create type public.product_type as enum ('topup', 'giftcard', 'subscription', 'account');
create type public.delivery_type as enum ('instant_code', 'manual_topup', 'account_credentials');
create type public.payment_method_type as enum ('bkash', 'nagad', 'rocket', 'bank', 'other');
create type public.discount_type as enum ('percent', 'fixed');
create type public.order_status as enum (
  'pending',
  'payment_review',
  'paid',
  'processing',
  'completed',
  'cancelled',
  'refunded'
);
create type public.payment_submission_status as enum ('pending', 'verified', 'rejected');
create type public.review_status as enum ('pending', 'approved', 'rejected');
create type public.banner_placement as enum ('hero', 'promo', 'category', 'gift_card');
create type public.homepage_section_type as enum (
  'hero_banner',
  'search_bar',
  'popular_games',
  'trending_games',
  'featured_gift_cards',
  'featured_categories',
  'best_sellers',
  'latest_products',
  'flash_deals',
  'why_choose_us',
  'testimonials',
  'faq',
  'newsletter'
);
create type public.blog_status as enum ('draft', 'published');

-- Shared trigger: keep updated_at current on every row update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
