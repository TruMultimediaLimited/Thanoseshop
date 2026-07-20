# Component Catalog — Thanos E-Shop

## `components/ui/` — primitives (hand-built shadcn-style)

accordion, alert-dialog, avatar, badge (variants: default/secondary/accent-gold/
destructive/outline), button, card, dropdown-menu, input, label, radio-group,
select, separator, sheet, skeleton, switch, table, tabs (**TabsContent uses
forceMount + CSS hiding — required for forms split across tabs; do not
remove**), textarea, navigation-menu.

## `components/layout/`

- `AnnouncementBar` — topmost active announcement above the header (server)
- `Header` — 3-element bar: search / centered logo / WhatsApp (server;
  fetches site settings only)
- `BottomNav` — fixed bottom tab bar (Home/FAQ/Cart/Profile), all viewports
- `WhatsAppFloat` — floating WhatsApp action button above the bottom bar
- `SearchButton` — boxed trigger + full-width drop-down search form (client)
- `Footer` — link columns, social icons, dynamic payment-method badges

## `components/home/`

`HeroBanner` (carousel), `CategoryPills`, `SearchBarSection`, `GamesRow`,
`ProductRailSection`, `FeaturedCategories`, `WhyChooseUs`, `Testimonials`,
`FaqSection`, `Newsletter`, `SectionHeading`.
Homepage sections are dispatched from `app/(storefront)/page.tsx` by
`homepage_sections.section_type`.

## `components/catalog/`

`ProductCard` (badges, wishlist, price/from-price; exports `formatPrice`),
`ProductGrid`, `GameCard` (poster style, banner_url→logo_url fallback),
`CategoryCard`, `ProductDetailClient` (gallery + variant selector + add to
cart), `VariantSelector`, `WishlistButton`, `ReviewForm`, `ReviewsList`.

## `components/checkout/`

`CheckoutForm` (payment method, trx ID, WebP-converted screenshot upload,
coupon), `CartItemRow`.

## `components/common/`

`EmptyState`, `Pagination`, `StatusBadge`.

## `components/admin/`

`AdminSidebar`/`AdminNavLinks` (flat 12-item role-filtered nav, desktop
aside), `AdminMobileNav` (drawer version for mobile), `ImageUploader` (WebP conversion,
click-to-replace), `AdvancedSection` (**plain CSS-toggle collapsible that
keeps fields mounted — use this, not Radix Accordion, inside forms**),
`MediaUploadCard`, `analytics/DashboardCharts` (recharts revenue/orders
charts on the dashboard), form components per resource under
`products/ games/ categories/ regions/ coupons/ banners/ faqs/ blog/
homepage/ payments/ settings/ announcements/ static-pages/`, plus
`ProductVariantsEditor`, `products/ProductsTable` (client table with bulk
select/publish/archive/duplicate + CSV export), `GalleryEditor` (multi-image editor for
`products.gallery`), and `orders/OrderTimeline` (status timeline +
internal notes with add-note form).

## Reuse rules

- Check this catalog before creating any new component.
- Forms: native `<form action>` + `useActionState` + hidden inputs for
  controlled Radix widgets (Select/Switch) — follow `ProductForm` as the
  reference implementation.
- Images: always `next/image`; admin-uploaded assets flow through
  `ImageUploader` → `toWebp()`.
