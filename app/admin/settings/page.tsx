import type { Metadata } from "next";

import { SiteSettingsForm } from "@/components/admin/settings/SiteSettingsForm";
import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types/content";

export const metadata: Metadata = { title: "Website Settings | Admin" };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Website Settings</h1>
      <SiteSettingsForm settings={data as SiteSettings | null} />
    </div>
  );
}
