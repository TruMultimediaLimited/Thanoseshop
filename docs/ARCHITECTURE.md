# Architecture — Thanos E-Shop

## Stack

- **Next.js 16** (App Router, Turbopack, `proxy.ts` convention — Next 16
  renamed `middleware.ts`), TypeScript, Tailwind CSS v4 (CSS-first config in
  `app/globals.css`, no tailwind.config).
- **shadcn/ui-style primitives, hand-built** in `components/ui/**` (Radix UI +
  CVA + `cn()`); the shadcn CLI was not used.
- **Supabase**: Postgres, Auth (`@supabase/ssr`), Storage. RLS is the real
  security boundary.
- **Vercel** hosting. **framer-motion** for the (deliberately minimal)
  scroll/section animations.

## Layout & routing

```
app/
  (storefront)/          ← public site + customer dashboard (Header/Footer layout)
    page.tsx             ← homepage, driven by homepage_sections rows
    products, games, categories, gift-cards, blog, cart, checkout,
    account/**, login/register/forgot/reset, static+legal pages
  admin/**               ← admin panel (own layout: sidebar + role guard)
  api/upload/payment-screenshot/route.ts   ← the only route handler
  sitemap.ts, robots.ts
proxy.ts                 ← session refresh + route protection (Next 16 proxy)
```

Route groups give the storefront and admin different layout trees under one
root layout (`app/layout.tsx`, hardcodes the `dark` class).

## Data-flow rules

- **Reads** = Server Components calling query helpers in
  `lib/supabase/queries/**` (server-only).
- **Writes** = Server Actions in `lib/actions/**` (`"use server"`), validated
  with Zod schemas from `lib/validation/**`, bound to native `<form action>` +
  `useActionState`. FormData string fields are read via
  `formString()` (`lib/actions/admin/form.ts`) — never bare `formData.get()`
  (null-vs-empty-string Zod bug class).
- **Atomic checkout** = `place_order()` Postgres RPC (SECURITY DEFINER),
  called by `lib/actions/checkout.ts`.
- File uploads: client converts images to WebP ≤1920px (`lib/image.ts`)
  before upload. Payment screenshots go through the route handler into the
  private bucket; admin images go directly to the public bucket.

## Authorization layers

1. **RLS** (database) — admin vs owner vs public on every table; the
   authoritative boundary.
2. `proxy.ts` — redirects unauthenticated users off `/account`, `/checkout`,
   `/admin`; quick role check for `/admin`.
3. `requireAdmin()` (`lib/supabase/admin-guard.ts`) in the admin layout, and
   `requireAdminRole([...])` (`lib/actions/admin/guard.ts`) in every admin
   server action — fixed-role gating (`AdminRole` in `lib/types/admin.ts`).

## Conventions

- Everything non-route lives under `lib/` (actions, queries, validation,
  types) — no parallel top-level trees.
- Soft delete via `deleted_at` on catalog/content tables; product variants are
  never hard-deleted (order_items FK).
- Sandbox note: the dev environment that builds this repo has no network path
  to Supabase/Vercel; migrations are pasted into the Supabase SQL Editor by
  the owner, and deployments happen via Vercel Git integration.
