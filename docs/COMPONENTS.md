# Component Catalog — Thanos E-Shop

## `components/ui/` — primitives (hand-built shadcn-style)

accordion, alert-dialog, avatar, badge (variants: default/secondary/accent-gold/
destructive/outline), button, card, dropdown-menu, input, label, radio-group,
select, separator, sheet, skeleton, switch, table, tabs (**TabsContent uses
forceMount + CSS hiding — required for forms split across tabs; do not
remove**), textarea, navigation-menu.

## `components/layout/`

- `AnnouncementBar` — topmost active announcement above the header (server)
- `Header` — centered-logo 5-element bar + desktop nav row (server; fetches
  settings/categories/user)
- `SearchButton` — boxed trigger + full-width drop-down search form (client)
- `UserMenu` — avatar dropdown: Profile/Orders/Wishlist/Admin/Logout (client)
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

`EmptyState`, `Pagination`, `StatusBadge`, `FadeIn` (framer-motion).

## `components/admin/`

`AdminSidebar` (role-filtered nav), `ImageUploader` (WebP conversion,
click-to-replace), `AdvancedSection` (**plain CSS-toggle collapsible that
keeps fields mounted — use this, not Radix Accordion, inside forms**),
`MediaUploadCard`, `analytics/DashboardCharts` (recharts revenue/orders
charts on the dashboard), form components per resource under
`products/ games/ categories/ regions/ coupons/ banners/ faqs/ blog/
homepage/ payments/ settings/ announcements/ static-pages/`, plus
`ProductVariantsEditor`, `GalleryEditor` (multi-image editor for
`products.gallery`), and `orders/OrderTimeline` (status timeline +
internal notes with add-note form).

## Reuse rules

- Check this catalog before creating any new component.
- Forms: native `<form action>` + `useActionState` + hidden inputs for
  controlled Radix widgets (Select/Switch) — follow `ProductForm` as the
  reference implementation.
- Images: always `next/image`; admin-uploaded assets flow through
  `ImageUploader` → `toWebp()`.
