# Roadmap — Thanos E-Shop

Process rule (owner's execution rules): **one module at a time; each module
ends with verify → commit/push → owner approval before the next.** Docs are
updated with every module.

## Done (Phases 0–7 + follow-ups)

Full production build: schema (11 migrations, live), storefront (homepage,
catalog, product pages, cart/checkout with manual-payment proof), customer
dashboard + auth, complete admin panel (orders/payment verification + full
catalog/content CRUD), SEO layer, deployment on Vercel; brand logo, black +
orange/gold design system, centered-logo header, mobile nav auth state,
tabbed-form fixes, admin form simplification, WebP upload pipeline.

## Module 1 — Docs pack + design-system retheme ✅

`/docs` folder, exact spec palette (#000 / #111 / #181818 / #1F1F1F /
#FF6A00 / #FFC107 / #22C55E), button/card/input polish, desktop nav row,
footer social + payment strip, framer-motion FadeIn.

## Module 2 — DB deltas + admin management ✅

Migration `00000000000012_spec_deltas.sql`: `order_events` (timeline + notes,
trigger-logged), `announcements`, `static_pages`, `products.compare_at_price`
+ RLS (gallery reuses the existing `products.gallery` jsonb column); admin
CRUD for Announcements + Static Pages; order detail timeline/notes UI;
ProductForm gallery editor + sale price.

## Module 3 — Storefront consumption ✅ (this module)

Announcement top-bar above the header, `/pages/[slug]` static page route
(+ sitemap entries), product page gallery with thumbnail switcher,
sale-price strikethrough + percent-off badges on product page and cards.

## Module 4 — Admin analytics ✅

Dashboard: six stat cards (adds 30-day revenue + customer count), 30-day
revenue area chart + orders bar chart (recharts, theme chart tokens,
single-series each), recent-orders table with status badges.

## Module 5 — Bulk product actions ✅

Products/Gift Cards admin tables gain row selection with bulk Publish /
Unpublish / Archive, single-select Duplicate (copies product + variants as
a draft with a -copy slug), and client-side CSV export (selected or all).

## Storefront v2 — simple skin ✅ (latest)

Owner feedback: the site felt bulky/cluttered; they wanted simple. The
customer-facing skin was replaced wholesale (backend/checkout/admin
untouched): 3-element fixed header (search / centered logo / WhatsApp),
no hero banner, a fixed homepage of exactly two sections (Popular Games,
Gift Cards), and a fixed bottom tab bar (Home / FAQ / Cart / Profile) on
all screens. framer-motion removed. The homepage no longer reads
homepage_sections — it is fixed-structure by explicit owner decision; the
Homepage Manager and Banner admin sections remain for future use.

## Deferred (explicit owner decisions)

Brands, Tags, Blog Categories, Email/Notification templates, per-game region
join, payment gateway, bulk import, referral/affiliate, wallet.
