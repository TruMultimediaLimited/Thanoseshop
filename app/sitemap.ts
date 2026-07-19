import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";

const STATIC_ROUTES = [
  "",
  "/products",
  "/gift-cards",
  "/about",
  "/contact",
  "/faq",
  "/blog",
  "/terms",
  "/privacy-policy",
  "/refund-policy",
  "/login",
  "/register",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thanoseshop.vercel.app";
  const supabase = await createClient();

  const [{ data: products }, { data: categories }, { data: games }, { data: posts }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_published", true).is("deleted_at", null),
    supabase.from("categories").select("slug, updated_at").eq("is_published", true).is("deleted_at", null),
    supabase.from("games").select("slug, updated_at").eq("is_published", true).is("deleted_at", null),
    supabase.from("blog_posts").select("slug, updated_at").eq("status", "published").is("deleted_at", null),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.7,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...(products ?? []).map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...(categories ?? []).map((c) => ({
      url: `${baseUrl}/categories/${c.slug}`,
      lastModified: c.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...(games ?? []).map((g) => ({
      url: `${baseUrl}/games/${g.slug}`,
      lastModified: g.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...(posts ?? []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
