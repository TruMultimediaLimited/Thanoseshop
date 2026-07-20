-- Thanos E-Shop demo seed data.
-- Run this in the Supabase SQL Editor AFTER all 11 migrations. Safe to run
-- once; re-running will error on duplicate slugs/codes (harmless — just
-- means it's already seeded). This bypasses RLS (SQL Editor runs as the
-- postgres superuser), so no admin account is required first.

-- ============================================================
-- Payment methods (required for checkout to work at all)
-- ============================================================
insert into public.payment_methods (name, type, account_number, account_name, instructions, sort_order) values
  ('bKash', 'bkash', '01700000000', 'Thanos E-Shop', 'Send Money to this number, then enter the Transaction ID below.', 1),
  ('Nagad', 'nagad', '01800000000', 'Thanos E-Shop', 'Send Money to this number, then enter the Transaction ID below.', 2),
  ('Rocket', 'rocket', '01900000000', 'Thanos E-Shop', 'Send Money to this number, then enter the Transaction ID below.', 3);

insert into public.payment_methods (name, type, account_number, account_name, bank_name, branch, routing_number, instructions, sort_order) values
  ('Bank Transfer', 'bank', '1234567890123', 'Thanos E-Shop Ltd', 'Dutch-Bangla Bank', 'Gulshan Branch', '090261234', 'Transfer to this account, then enter your Transaction/Reference ID below.', 4);

-- ============================================================
-- Regions
-- ============================================================
insert into public.regions (name, code, sort_order) values
  ('Bangladesh', 'BD', 1),
  ('Global', 'GLOBAL', 2),
  ('MENA', 'MENA', 3),
  ('Indonesia', 'ID', 4);

-- ============================================================
-- Categories
-- ============================================================
insert into public.categories (name, slug, description, sort_order) values
  ('Battle Royale', 'battle-royale', 'Top-ups for battle royale games.', 1),
  ('MOBA', 'moba', 'Top-ups for MOBA games.', 2),
  ('Gift Cards', 'gift-cards', 'Global gift cards and wallet top-ups.', 3),
  ('Subscriptions', 'subscriptions', 'Streaming and service subscriptions.', 4);

-- ============================================================
-- Games
-- ============================================================
insert into public.games (name, slug, category_id, publisher, is_popular, is_trending, sort_order)
select 'PUBG Mobile', 'pubg-mobile', id, 'Krafton', true, false, 1 from public.categories where slug = 'battle-royale';

insert into public.games (name, slug, category_id, publisher, is_popular, is_trending, sort_order)
select 'Free Fire', 'free-fire', id, 'Garena', true, false, 2 from public.categories where slug = 'battle-royale';

insert into public.games (name, slug, category_id, publisher, is_popular, is_trending, sort_order)
select 'Mobile Legends', 'mobile-legends', id, 'Moonton', true, true, 3 from public.categories where slug = 'moba';

insert into public.games (name, slug, category_id, publisher, is_popular, is_trending, sort_order)
select 'Genshin Impact', 'genshin-impact', id, 'HoYoverse', false, true, 4 from public.categories where slug = 'moba';

-- ============================================================
-- Products: game top-ups (with variants)
-- ============================================================

-- PUBG Mobile UC
with p as (
  insert into public.products (
    name, slug, product_type, game_id, category_id, region_id,
    has_variants, delivery_type, requires_player_id, delivery_instructions,
    is_published, is_featured, is_best_seller, thumbnail_url
  )
  select
    'PUBG Mobile UC (Global UID)', 'pubg-mobile-uc-global', 'topup',
    g.id, g.category_id, r.id,
    true, 'manual_topup', true, 'Enter your PUBG Mobile Player ID (found in the in-game profile screen).',
    true, true, true, null
  from public.games g, public.regions r
  where g.slug = 'pubg-mobile' and r.code = 'GLOBAL'
  returning id
)
insert into public.product_variants (product_id, name, price, sort_order)
select id, v.name, v.price, v.sort_order from p, (values
  ('60 UC', 120.00, 1),
  ('325 UC', 600.00, 2),
  ('660 UC', 1150.00, 3),
  ('1800 UC', 2999.00, 4)
) as v(name, price, sort_order);

-- Free Fire Diamonds (Bangladesh)
with p as (
  insert into public.products (
    name, slug, product_type, game_id, category_id, region_id,
    has_variants, delivery_type, requires_player_id, delivery_instructions,
    is_published, is_featured, is_trending, thumbnail_url
  )
  select
    'Free Fire Diamonds (Bangladesh)', 'free-fire-diamonds-bd', 'topup',
    g.id, g.category_id, r.id,
    true, 'manual_topup', true, 'Enter your Free Fire Player ID (visible under your in-game avatar).',
    true, true, true, null
  from public.games g, public.regions r
  where g.slug = 'free-fire' and r.code = 'BD'
  returning id
)
insert into public.product_variants (product_id, name, price, sort_order)
select id, v.name, v.price, v.sort_order from p, (values
  ('100 Diamonds', 85.00, 1),
  ('310 Diamonds', 250.00, 2),
  ('520 Diamonds', 410.00, 3),
  ('1080 Diamonds', 820.00, 4)
) as v(name, price, sort_order);

-- Mobile Legends Diamonds (Global)
with p as (
  insert into public.products (
    name, slug, product_type, game_id, category_id, region_id,
    has_variants, delivery_type, requires_player_id, delivery_instructions,
    is_published, is_featured, thumbnail_url
  )
  select
    'Mobile Legends Diamonds (Global)', 'mobile-legends-diamonds-global', 'topup',
    g.id, g.category_id, r.id,
    true, 'manual_topup', true, 'Enter your Mobile Legends User ID and Zone ID, separated by a comma.',
    true, true, null
  from public.games g, public.regions r
  where g.slug = 'mobile-legends' and r.code = 'GLOBAL'
  returning id
)
insert into public.product_variants (product_id, name, price, sort_order)
select id, v.name, v.price, v.sort_order from p, (values
  ('86 Diamonds', 130.00, 1),
  ('172 Diamonds', 250.00, 2),
  ('257 Diamonds', 370.00, 3),
  ('706 Diamonds', 990.00, 4)
) as v(name, price, sort_order);

-- Genshin Impact Genesis Crystals (Global)
with p as (
  insert into public.products (
    name, slug, product_type, game_id, category_id, region_id,
    has_variants, delivery_type, requires_player_id, delivery_instructions,
    is_published, is_trending, thumbnail_url
  )
  select
    'Genshin Impact Genesis Crystals (Global)', 'genshin-impact-crystals-global', 'topup',
    g.id, g.category_id, r.id,
    true, 'manual_topup', true, 'Enter your in-game UID (found in your Genshin Impact profile).',
    true, true, null
  from public.games g, public.regions r
  where g.slug = 'genshin-impact' and r.code = 'GLOBAL'
  returning id
)
insert into public.product_variants (product_id, name, price, sort_order)
select id, v.name, v.price, v.sort_order from p, (values
  ('60 Crystals', 90.00, 1),
  ('300 + 30 Crystals', 430.00, 2),
  ('980 + 110 Crystals', 1350.00, 3)
) as v(name, price, sort_order);

-- ============================================================
-- Products: gift cards / subscriptions (flat price, no variants)
-- ============================================================
insert into public.products (
  name, slug, product_type, category_id, has_variants, base_price,
  delivery_type, requires_player_id, is_published, is_featured, thumbnail_url
)
select 'Steam Wallet Code ($10)', 'steam-wallet-10', 'giftcard', id, false, 1250.00,
  'instant_code', false, true, true, null
from public.categories where slug = 'gift-cards';

insert into public.products (
  name, slug, product_type, category_id, has_variants, base_price,
  delivery_type, requires_player_id, is_published, is_featured, thumbnail_url
)
select 'Google Play Gift Card ($25)', 'google-play-25', 'giftcard', id, false, 3100.00,
  'instant_code', false, true, true, null
from public.categories where slug = 'gift-cards';

insert into public.products (
  name, slug, product_type, category_id, has_variants, base_price,
  delivery_type, requires_player_id, is_published, thumbnail_url
)
select 'PlayStation Network Card ($20)', 'psn-20', 'giftcard', id, false, 2500.00,
  'instant_code', false, true, null
from public.categories where slug = 'gift-cards';

insert into public.products (
  name, slug, product_type, category_id, has_variants, base_price,
  delivery_type, requires_player_id, is_published, is_best_seller, thumbnail_url
)
select 'Netflix Premium (1 Month)', 'netflix-premium-1-month', 'subscription', id, false, 650.00,
  'account_credentials', false, true, true, null
from public.categories where slug = 'subscriptions';

insert into public.products (
  name, slug, product_type, category_id, has_variants, base_price,
  delivery_type, requires_player_id, is_published, thumbnail_url
)
select 'Spotify Premium (1 Month)', 'spotify-premium-1-month', 'subscription', id, false, 300.00,
  'account_credentials', false, true, null
from public.categories where slug = 'subscriptions';

-- ============================================================
-- FAQs (site-wide)
-- ============================================================
insert into public.faqs (question, answer, sort_order) values
  ('How long does delivery take?', 'Most orders are processed within a few minutes of payment verification. Some manual top-ups may take up to a few hours during peak times.', 1),
  ('What payment methods do you accept?', 'We currently accept bKash, Nagad, Rocket, and direct bank transfer. Enter your transaction ID and upload a screenshot at checkout for verification.', 2),
  ('What if I entered the wrong Player ID?', 'Please double-check your Player ID/UID before submitting your order — we are unable to reverse a top-up delivered to an incorrect account.', 3),
  ('Is it safe to use my account here?', 'Yes — every order is manually verified by our team before delivery, and your data is protected with strict access controls.', 4);

-- ============================================================
-- Homepage sections (in display order)
-- ============================================================
insert into public.homepage_sections (section_type, title, subtitle, sort_order, config) values
  ('hero_banner', null, null, 1, '{}'),
  ('search_bar', 'What are you topping up today?', 'Search any game, gift card, or subscription.', 2, '{}'),
  ('popular_games', 'Popular Games', null, 3, '{"limit": 8}'),
  ('featured_gift_cards', 'Gift Cards & Subscriptions', null, 4, '{"limit": 8}'),
  ('best_sellers', 'Best Sellers', null, 5, '{"limit": 8}'),
  ('latest_products', 'New Arrivals', null, 6, '{"limit": 8}'),
  ('why_choose_us', 'Why Choose Thanos E-Shop', null, 7, '{}'),
  ('faq', 'Frequently Asked Questions', null, 8, '{}'),
  ('newsletter', null, null, 9, '{}');

-- ============================================================
-- A demo hero banner (uses a placeholder image — replace via
-- Admin > Banner Manager once you have real artwork)
-- ============================================================
insert into public.banners (title, subtitle, image_url, placement, sort_order) values
  (
    'Instant Top-Ups, Trusted Delivery',
    'PUBG UC, Free Fire Diamonds, gift cards and more — verified and delivered fast.',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&h=534&fit=crop',
    'hero',
    1
  );
