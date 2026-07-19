# Database — Thanos E-Shop (Supabase Postgres)

11 migrations in `supabase/migrations/`, all applied to the live project via
the SQL Editor. UUID PKs, `created_at`/`updated_at` everywhere (trigger-managed
`updated_at`), soft delete (`deleted_at`) on catalog/content tables, FK +
index coverage per relationship. RLS enabled on every table.

## Migrations

| File | Contents |
|---|---|
| 01_extensions_and_helpers | pgcrypto, `set_updated_at()`, `is_admin()` helper |
| 02_profiles | `profiles` (role: customer/admin; admin_role enum), signup trigger, self-privilege-escalation guard |
| 03_catalog | `regions`, `categories` (self-FK parent_id = subcategories), `games`, `products`, `product_variants` |
| 04_cart | `carts`, `cart_items` (partial unique indexes for NULL variant merge) |
| 05_commerce | `payment_methods`, `coupons`, `coupon_usages`, `orders`, `order_items`, `payment_submissions` |
| 06_content | `reviews`, `wishlists`, `faqs`, `banners`, `homepage_sections`, `blog_posts` |
| 07_platform | `media`, `site_settings` (single row id=1), `seo_settings`, `notifications`, `audit_logs` |
| 08_functions | `place_order()`, `validate_coupon()` RPCs (atomic checkout: totals recomputed server-side, stock decrement, coupon usage, cart clear) |
| 09_rls | All RLS policies (admin vs owner vs public) |
| 10_storage | Buckets: `public-assets` (public read/admin write), `payment-screenshots` (private, `{user_id}/...` paths) |
| 11_newsletter | `newsletter_subscribers` |

## Key modelling decisions

- **One `products` table** with `product_type` discriminator (topup, giftcard,
  subscription, account); denominations in `product_variants`. Gift cards are
  products, not a separate table.
- **Order status enum**: pending, payment_review, paid, processing, completed,
  cancelled, refunded.
- **Variants are soft-deleted only** — `order_items.variant_id` FK defaults to
  NO ACTION, so a variant that was ever ordered cannot be hard-deleted.
- **Roles**: `profiles.role` + `profiles.admin_role` enum
  (super_admin/order_manager/product_manager/support). RLS distinguishes only
  customer vs admin; fine-grained role gating happens in server actions.
- Security-tested locally against a Postgres 16 harness (stubbed auth/storage
  schemas): RLS isolation, coupon privacy, self-promotion guard (which caught
  a real `SECURITY DEFINER`/`current_user` bug — the guard trigger must NOT be
  SECURITY DEFINER).

## Planned deltas (Module 2, approved scope)

`order_events` (timeline + notes via event_type enum), `announcements`,
`static_pages`, `product_images` (gallery), `products.compare_at_price`
(sale price). Deferred: brands, tags, blog_categories, email/notification
templates.
