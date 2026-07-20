import "server-only";
import type { Metadata } from "next";

import { getSeoSettings, getSiteSettings } from "@/lib/supabase/queries/settings";

export async function getPageMetadata(pageKey: string, fallbackTitle?: string): Promise<Metadata> {
  const [settings, seo] = await Promise.all([getSiteSettings(), getSeoSettings(pageKey)]);

  const siteName = settings?.site_name ?? "Thanos E-Shop";
  const title = seo?.meta_title || fallbackTitle || settings?.default_meta_title || siteName;
  const description = seo?.meta_description || settings?.default_meta_description || undefined;

  return {
    title,
    description,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
    openGraph: {
      title,
      description,
      siteName,
      images: seo?.og_image_url ? [seo.og_image_url] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo?.og_image_url ? [seo.og_image_url] : undefined,
    },
  };
}
