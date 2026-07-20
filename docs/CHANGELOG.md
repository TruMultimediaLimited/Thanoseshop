# Changelog — Thanos E-Shop

Newest first. One entry per meaningful push to `claude/website-design-dmss7e`.

## Minimal footer
- Footer slimmed to: site name + tagline, three links (About Us, Terms &
  Conditions, Refund Policy), social icons, copyright. The Shop/Support
  link columns, Blog/Privacy links, and the "We accept" payment strip
  are gone — homepage covers products, the bottom nav covers FAQ, and
  the WhatsApp float covers contact. One fewer query per page (payment
  methods no longer fetched).

## Uniform compact tiles + image-free purchase page
- Every homepage box is now the exact same size (the PUBG/Free Fire
  size): fixed-height name panel with 2-line clamp, so long names
  (Mobile Legends, Honkai Star Rail…) no longer stretch their cards.
- Gift-card tiles match the game tiles — image + name only, in the same
  3/4/6-column grid. Prices, discount badges, and wishlist hearts are
  gone from tiles; price appears on the purchase page.
- Product purchase page no longer renders images or a gallery — it opens
  straight to title, price, package selector, and Add to Cart (wishlist
  heart moved beside the title). Listing pages also dropped their
  per-request wishlist query. Faster loads all around.
- Deleted unused `ProductRailSection` leftover from the old homepage.

## Simple product form (owner's reference)
- Admin product form stripped to the essentials: Name, Product Type
  (+ Game for top-ups), Thumbnail, package list, Requires Player ID,
  Published. Everything else (slug, category/region, descriptions,
  delivery, gallery, flags, SEO) moved into the Advanced section.
- Package editor rebuilt to match the owner's reference: per-package
  Title / Stock dropdown (Stock Available ↔ Out of Stock) / Previous
  Price / Current Price rows with an "Add Package" button. New products
  default to the package list.
- Slug is now optional — left blank, it is auto-generated from the name
  (with a unique-suffix retry if the generated slug collides).

## Polish 3: deep navy background (owner's reference pick)
- Page background switched to deep navy #10141F (from the rmtgameshop
  reference the owner chose) with near-white text; cards and menus stay
  white with dark text — the reference's label-panel look.
- Header and bottom nav are navy glass bars (bg-[#161a28]/90 + blur,
  white/10 border); footer sits directly on the navy with a subtle top
  border; footer logo removed (site-name text instead).
- Border/input tokens moved to mid-gray at partial opacity so they stay
  visible on both the navy page and white cards.

## Polish 2: new wordmark logo, translucent bars
- New THANOS ESHOP wordmark logo (red + silver, white background made
  transparent, trimmed) replaces the old emblem in the header (now
  left-aligned), footer, and favicon.
- Header and bottom nav are now translucent glass bars (bg-card/70-75 +
  backdrop blur, soft border) so the page feels seamless while the bars
  stay distinguishable.

## Polish: gray background, logo-only header, flat cards
- Background deepened from near-white to light gray (#E9EAEC) — stark
  white also strained the owner's eyes; cards stay white on top.
- Header now holds only the centered logo, sitting in a small black pill
  (the flame emblem was drawn for a black field); search button removed
  (SearchButton deleted — search remains on the products page).
- Game and product cards flattened to landscape (aspect-video) with
  untruncated names; grids retuned to 2-col mobile / 4-col desktop.
- WhatsApp float raised (bottom-24), shrunk to 44px, 90% opacity.

## Light theme + floating WhatsApp + simplified admin nav
- Whole site (storefront + admin) switched to a soft light theme: #F6F6F7
  background, white cards, soft-black text, orange primary. `dark` class
  removed from <html>; card shadows softened; prose-invert dropped.
- WhatsApp moved out of the header into a floating green action button
  above the bottom bar (owner's reference). Header is now search + logo.
- Header and bottom nav restyled as light boxed bars (white card surface
  with subtle border + shadow separation).
- Admin nav simplified to the owner's reference list — a flat 12-item menu
  (Dashboard, Order List, Add New Product, Manage Products/Games/Notice/
  FAQ/Reviews/Users, Payment Methods, Site Settings, My Profile); hidden
  sections keep working by URL. Sidebar hidden on mobile behind a drawer,
  fixing the congested mobile admin layout.

## Storefront v2 — simple skin
- Header slimmed to search / centered logo / WhatsApp (one settings query,
  no auth/categories fetches); sticky together with the announcement bar.
- New fixed BottomNav (Home / FAQ / Cart / Profile) on all viewports.
- Homepage rewritten to a fixed two-section layout: Popular Games grid +
  Gift Cards grid (2 queries, was ~10; hero/pills/testimonials/newsletter
  sections dropped).
- Removed framer-motion, FadeIn, UserMenu (profile now lives in the bottom
  bar; account sidebar keeps Admin Panel + sign out).

## Module 5 — Bulk product actions
- ProductsTable (shared by Products and Gift Cards admin pages): row
  checkboxes + select-all, bulk Publish/Unpublish/Archive, Duplicate for a
  single selection (copies the product and its variants as an unpublished
  draft with a "-copy" slug), CSV export of selected or all rows.
- New actions: duplicateProduct, bulkSetProductsPublished,
  bulkArchiveProducts.

## Module 4 — Admin analytics
- Dashboard: 30-day revenue area chart + orders bar chart (recharts, one
  series per chart, theme tokens), Revenue(30d)/Customers stat cards, and a
  recent-orders table with status badges and links.
- Revenue counts paid/processing/completed orders only.

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
