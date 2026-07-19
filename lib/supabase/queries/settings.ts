import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { SeoSettings, SiteSettings } from "@/lib/types/content";

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data as SiteSettings;
}

export async function getSeoSettings(pageKey: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();

  if (error) throw error;
  return data as SeoSettings | null;
}
