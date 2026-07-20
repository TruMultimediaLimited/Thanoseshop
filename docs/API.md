# API Surface — Thanos E-Shop

There is no public REST API. The app's write surface is Server Actions, one
route handler, and two Postgres RPCs. All reads go through server-only query
helpers (`lib/supabase/queries/**`) guarded by RLS.

## Route handlers

| Route | Method | Purpose |
|---|---|---|
| `/auth/callback` | GET | Supabase email-confirmation code exchange, then redirect. |

(The former `/api/upload/payment-screenshot` route was removed — checkout
collects only a transaction ID, validated per method: bKash 10 chars,
Nagad 8.)

## Postgres RPCs

- `place_order(...)` — atomic checkout: recomputes totals from DB prices,
  validates coupon, creates order + order_items + payment_submission,
  decrements stock, clears cart. Called only from `lib/actions/checkout.ts`.
- `validate_coupon(code, subtotal)` — server-side coupon check.

## Server actions (by file, `lib/actions/`)

- `cart.ts` — addToCart, updateCartItemQuantity, removeCartItem, clearCart
- `checkout.ts` — placeOrder (wraps the RPC)
- `wishlist.ts`, `profile.ts`, `reviews.ts`, `newsletter.ts`
- `admin/guard.ts` — `requireAdminRole(allowed)`; every admin action calls it
- `admin/form.ts` — `formString()` FormData normalizer (required for all
  admin form parsers)
- `admin/orders.ts` — verifyPayment, rejectPayment, startProcessing,
  deliverOrderItem, markOrderCompleted, refundOrder, addOrderNote
  (role: order_manager)
- `admin/announcements.ts`, `admin/static-pages.ts` — CRUD
  (role: product_manager)
- `admin/products.ts` (+ `syncVariants` soft-delete logic, duplicateProduct,
  bulkSetProductsPublished, bulkArchiveProducts), `admin/games.ts`,
  `admin/categories.ts`, `admin/regions.ts`, `admin/coupons.ts`,
  `admin/banners.ts`, `admin/faqs.ts`, `admin/blog.ts`,
  `admin/homepage-sections.ts`, `admin/payment-methods.ts`,
  `admin/settings.ts` (site + SEO), `admin/reviews.ts`, `admin/users.ts`,
  `admin/media.ts`, `admin/notifications.ts` (role: product_manager or
  super_admin as appropriate)

## Contract rules

- Actions return `{ ok: boolean; message?: string }` and are consumed via
  `useActionState`.
- Every action re-validates input with Zod (`lib/validation/**`) — client
  values are never trusted; prices always come from the database.
