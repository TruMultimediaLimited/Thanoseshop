"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { seoSettingSchema, siteSettingsSchema } from "@/lib/validation/admin/settings";

interface ActionResult {
  ok: boolean;
  message?: string;
}

export async function updateSiteSettings(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole([]);
  if (!gate.ok) return gate;

  const parsed = siteSettingsSchema.safeParse({
    siteName: formString(formData, "siteName"),
    logoUrl: formString(formData, "logoUrl"),
    faviconUrl: formString(formData, "faviconUrl"),
    contactEmail: formString(formData, "contactEmail"),
    contactPhone: formString(formData, "contactPhone"),
    whatsappNumber: formString(formData, "whatsappNumber"),
    facebookUrl: formString(formData, "facebookUrl"),
    footerText: formString(formData, "footerText"),
    defaultMetaTitle: formString(formData, "defaultMetaTitle"),
    defaultMetaDescription: formString(formData, "defaultMetaDescription"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      site_name: parsed.data.siteName,
      logo_url: parsed.data.logoUrl || null,
      favicon_url: parsed.data.faviconUrl || null,
      contact_email: parsed.data.contactEmail || null,
      contact_phone: parsed.data.contactPhone || null,
      whatsapp_number: parsed.data.whatsappNumber || null,
      facebook_url: parsed.data.facebookUrl || null,
      footer_text: parsed.data.footerText || null,
      default_meta_title: parsed.data.defaultMetaTitle || null,
      default_meta_description: parsed.data.defaultMetaDescription || null,
    })
    .eq("id", 1);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

export async function upsertSeoSetting(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole([]);
  if (!gate.ok) return gate;

  const parsed = seoSettingSchema.safeParse({
    pageKey: formString(formData, "pageKey"),
    metaTitle: formString(formData, "metaTitle"),
    metaDescription: formString(formData, "metaDescription"),
    ogImageUrl: formString(formData, "ogImageUrl"),
    canonicalUrl: formString(formData, "canonicalUrl"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("seo_settings").upsert(
    {
      page_key: parsed.data.pageKey,
      meta_title: parsed.data.metaTitle || null,
      meta_description: parsed.data.metaDescription || null,
      og_image_url: parsed.data.ogImageUrl || null,
      canonical_url: parsed.data.canonicalUrl || null,
    },
    { onConflict: "page_key" },
  );

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/seo");
  return { ok: true, message: "Saved." };
}
