import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/lib/types/content";

/**
 * RLS already restricts anonymous/customer reads to active + in-window
 * announcements, so no extra filtering is needed here for the storefront.
 */
export async function getActiveAnnouncements() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Announcement[];
}
