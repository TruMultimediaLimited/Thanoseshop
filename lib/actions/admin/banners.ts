"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { bannerSchema } from "@/lib/validation/admin/banner";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return bannerSchema.safeParse({
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    imageUrl: formData.get("imageUrl"),
    mobileImageUrl: formData.get("mobileImageUrl"),
    linkUrl: formData.get("linkUrl"),
    placement: formData.get("placement"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

function toRow(data: ReturnType<typeof bannerSchema.parse>) {
  return {
    title: data.title || null,
    subtitle: data.subtitle || null,
    image_url: data.imageUrl,
    mobile_image_url: data.mobileImageUrl || null,
    link_url: data.linkUrl || null,
    placement: data.placement,
    sort_order: data.sortOrder,
    is_active: data.isActive,
  };
}

export async function createBanner(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("banners").insert(toRow(parsed.data));
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function updateBanner(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("banners").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/banners");
  redirect("/admin/banners");
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("banners")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/banners");
  return { ok: true };
}
