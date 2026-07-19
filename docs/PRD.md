# Product Requirements Document — Thanos E-Shop

## Product

Thanos E-Shop is a premium Bangladeshi gaming marketplace selling game top-ups
(PUBG UC, Free Fire Diamonds, Mobile Legends Diamonds, Genshin Crystals, …),
gift cards (Steam, Google Play, PSN, …), and subscriptions (Netflix, Spotify, …).

Brand tagline: গেমারদের সেরা ঠিকানা.

## Core requirements (all confirmed with the owner)

- **Fully dynamic catalog** — products, games, gift cards, categories, regions,
  homepage sections, banners, FAQs, coupons, payment methods, and blog are all
  managed from the admin panel. Nothing catalog-related is hardcoded.
- **Manual payment only (v1)** — bKash / Nagad / Rocket / Bank Transfer.
  Customer submits a transaction ID + payment screenshot; an admin verifies
  and fulfills each order by hand. No gateway, no crypto, no wallet.
- **Login required for checkout** (no guest checkout).
- **Order status vocabulary**: pending → payment_review → paid → processing →
  completed, plus cancelled / refunded.
- **Fixed admin roles** (not a permission builder): super_admin,
  order_manager, product_manager, support.
- No referral/affiliate system, no automatic delivery.

## Audiences

- **Customers**: browse → register/login → cart → checkout with manual payment
  proof → track order in dashboard → review purchased products.
- **Admins**: verify payments, fulfill orders, manage the entire catalog and
  site content, moderate reviews, manage customers/admins and settings.

## Key user journeys

1. Top-up purchase: pick game → pick denomination (variant) → enter Player
   ID → cart → checkout → pay via bKash etc. → submit trx ID + screenshot →
   wait for verification → delivered.
2. Payment verification (admin): Orders → payment_review queue → open order →
   view screenshot (signed URL) → Verify/Reject → Process → Complete.

## Out of scope (deferred by explicit decision)

Brands, Tags, Blog Categories, Email/Notification template tables, per-game
region joins, payment gateway integration, bulk import.

## Live environment

- Production: https://thanoseshop.vercel.app (Vercel, branch
  `claude/website-design-dmss7e` deployments)
- Supabase project: `qrcbvaufbfjbvsiztdan` — all 11 migrations + demo seed run
  via SQL Editor by the owner.
