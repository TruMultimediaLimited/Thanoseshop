import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { HomepageSection } from "@/lib/types/content";

export async function getHomepageSections() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as HomepageSection[];
}
