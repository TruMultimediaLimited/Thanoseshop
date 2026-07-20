import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { StaticPage } from "@/lib/types/content";

export async function getStaticPageBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("static_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data as StaticPage | null;
}
