# Changelog — Thanos E-Shop

Newest first. One entry per meaningful push to `claude/website-design-dmss7e`.

## Module 3 — Storefront consumption
- AnnouncementBar renders the topmost active announcement above the header.
- `/pages/[slug]` serves admin-managed static pages (with SEO metadata and
  sitemap entries).
- Product page: gallery with clickable thumbnail switcher; sale price shows
  as current price + strikethrough compare-at + percent-off chip (works for
  both variant and non-variant products).
- ProductCard: percent-off badge and strikethrough compare-at price.

## Module 2 — DB deltas + admin management
- Migration 12 (`spec_deltas`): `order_events` table with a trigger that
  auto-logs every order status transition; `announcements`; `static_pages`;
  `products.compare_at_price`. Locally harness-tested (trigger + RLS).
- Admin: Announcements and Static Pages CRUD (list/new/edit + sidebar
  entries); order detail now shows a status timeline with admin-internal
  notes (addOrderNote); ProductForm gains a gallery editor
  (products.gallery) and a compare-at (sale) price field.

## Module 1 — Docs + design-system retheme
- Added `/docs` (PRD, ARCHITECTURE, DATABASE, API, ROADMAP, UI_GUIDELINES,
  COMPONENTS, CHANGELOG).
- Exact design-system palette: pure black background, #111/#181818/#1F1F1F
  surface ladder, orange #FF6A00 primary, gold #FFC107 accent (decorative
  only), green #22C55E success token.
- Button variants per spec (secondary = dark + orange border/text), neutral
  menu hovers (gold removed from interactive hover states), input h-10 /
  rounded-lg, card soft shadow.
- Desktop nav-links row under the header (Games, Gift Cards, categories,
  Contact); footer social icons + dynamic payment-method badges.
- framer-motion installed; FadeIn applied to homepage sections.

## Earlier history (from git)
- `74bfc4e` Header logo made prominent (transparent/cropped asset), buttons 36px
- `ae085ab` Black/flame-red theme + centered-logo 5-element header, hamburger removed
- `e1c2b56` Product/Game admin forms simplified (AdvancedSection collapsible)
- `8ed1210` Brand logo added to header, footer, favicon
- `4745655` Homepage cards redesigned (poster GameCard, CategoryPills)
- `3ff6190` formString() FormData normalizer across all admin actions
- `0107551` Tabs forceMount fix (tabbed forms no longer drop hidden fields)
- `1dee693` ImageUploader click-to-replace; variant field null handling
- `da13d8e` WebP upload conversion; mobile nav auth state
- `e981e7a` Header/account admin links + logged-in user menu
- `6673b30` Demo seed data
- `74bb416` Static pages, sitemap/robots, JSON-LD, reviews UI
- `77474e4` Admin completed (homepage manager, reviews, users, blog, settings)
- `07a7257` Admin coupons + products CRUD (variant editor)
- `51e8e73` Admin order verification, KPIs, catalog/content CRUD
- `ae9a68e` Storefront route group; admin shell
- `30fdc76` Auth pages + customer dashboard
- `981bbd2` Cart, checkout, order detail
- `4d273a6` Dynamic homepage + catalog pages + cart actions
- `e308673` Shared data layer, UI kit, site layout
- `0947422` Full Supabase schema, RLS, storage (11 migrations)
- `9f6d522` Next.js 16 scaffold
