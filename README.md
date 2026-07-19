# Thanos E-Shop

Premium marketplace for game top-ups, gift cards, and digital products, built for the Bangladeshi gaming market.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 + hand-built shadcn/ui (Radix UI primitives)
- [Supabase](https://supabase.com) — Postgres, Auth, Storage
- Deployed on Vercel

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase project's keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Schema lives in `supabase/migrations/`. Once you have a Supabase project, apply
them with the Supabase CLI (`supabase db push`) or paste them into the SQL
editor in order, then generate types:

```bash
npx supabase gen types typescript --project-id <ref> > lib/types/database.types.ts
```

The first admin account must be promoted manually — there is no self-serve
admin signup. After registering, run in the SQL editor:

```sql
update profiles set role = 'admin' where id = '<your-user-uuid>';
```
