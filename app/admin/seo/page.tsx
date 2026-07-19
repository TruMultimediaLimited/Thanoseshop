import type { Metadata } from "next";

import { SeoSettingForm } from "@/components/admin/settings/SeoSettingForm";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import type { SeoSettings } from "@/lib/types/content";

export const metadata: Metadata = { title: "SEO Manager | Admin" };

const PAGE_KEYS = ["home", "products", "gift-cards", "about", "contact", "faq"];

export default async function AdminSeoPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("seo_settings").select("*");
  const bySlug = new Map((data ?? []).map((row) => [row.page_key, row as SeoSettings]));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">SEO Manager</h1>
      <p className="text-muted-foreground -mt-4 text-sm">
        Per-page meta title/description overrides for static pages. Products, games, and
        categories manage their own SEO fields on their own edit forms.
      </p>

      <div className="flex flex-col gap-4">
        {PAGE_KEYS.map((pageKey) => (
          <Card key={pageKey} className="p-4">
            <p className="mb-3 font-medium capitalize">{pageKey.replace("-", " ")}</p>
            <SeoSettingForm pageKey={pageKey} setting={bySlug.get(pageKey) ?? null} />
          </Card>
        ))}
      </div>
    </div>
  );
}
