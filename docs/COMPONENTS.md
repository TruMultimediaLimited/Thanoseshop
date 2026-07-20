# Component Catalog — Thanos E-Shop

## `components/ui/` — primitives (hand-built shadcn-style)

accordion, alert-dialog, avatar, badge (variants: default/secondary/accent-gold/
destructive/outline), button, card, dropdown-menu, input, label, radio-group,
select, separator, sheet, skeleton, switch, table, tabs (**TabsContent uses
forceMount + CSS hiding — required for forms split across tabs; do not
remove**), textarea, navigation-menu.

## `components/layout/`

- `AnnouncementBar` — topmost active announcement above the header (server)
- `Header` — centered logo in a black pill (server; site settings only)
- `BottomNav` — fixed bottom tab bar (Home/FAQ/Cart/Profile), all viewports
- `WhatsAppFloat` — floating WhatsApp action button above the bottom bar
- `Footer` — minimal: site name + tagline, About/Terms/Refund links,
  social icons, copyright (site settings only, no payment-method fetch)

## `components/home/`

`HeroBanner` (carousel), `CategoryPills`, `SearchBarSection`, `GamesRow`,
`FeaturedCategories`, `WhyChooseUs`, `Testimonials`,
`FaqSection`, `Newsletter`, `SectionHeading`.
The homepage itself is a fixed two-section page (Popular Games + Gift
Cards); these components remain for other routes/legacy use.

## `components/catalog/`

`ProductCard` (compact image+name tile, identical size to `GameCard` —
no price/badges/wishlist on tiles; still exports `formatPrice`),
`ProductGrid` (3/4/6-col compact grid), `GameCard` (aspect-video image +
fixed h-9 clamp-2 name panel, banner_url→logo_url fallback),
`CategoryCard`, `ProductDetailClient` (image-free purchase page: title +
price + package selector + add to cart), `VariantSelector`,
`WishlistButton`, `ReviewForm`, `ReviewsList`.

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
`ProductVariantsEditor` (reference-style package rows: Title / Stock
dropdown (Available ↔ Out of Stock) / Previous Price / Current Price),
`products/ProductsTable` (client table with bulk
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
