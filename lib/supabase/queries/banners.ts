import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Banner, BannerPlacement } from "@/lib/types/content";

export async function getBanners(placement: BannerPlacement) {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("placement", placement)
    .eq("is_active", true)
    .is("deleted_at", null)
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Banner[];
}
