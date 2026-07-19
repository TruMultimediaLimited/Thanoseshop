"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { staticPageSchema } from "@/lib/validation/admin/static-page";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return staticPageSchema.safeParse({
    slug: formString(formData, "slug"),
    title: formString(formData, "title"),
    content: formString(formData, "content"),
    metaTitle: formString(formData, "metaTitle"),
    metaDescription: formString(formData, "metaDescription"),
    isPublished: formData.get("isPublished") === "on",
  });
}

function toRow(data: ReturnType<typeof staticPageSchema.parse>) {
  return {
    slug: data.slug,
    title: data.title,
    content: data.content,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
    is_published: data.isPublished,
  };
}

export async function createStaticPage(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("static_pages").insert(toRow(parsed.data));
  if (error) {
    return { ok: false, message: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  revalidatePath("/admin/static-pages");
  redirect("/admin/static-pages");
}

export async function updateStaticPage(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("static_pages").update(toRow(parsed.data)).eq("id", id);
  if (error) {
    return { ok: false, message: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  revalidatePath("/admin/static-pages");
  redirect("/admin/static-pages");
}

export async function deleteStaticPage(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("static_pages")
    .update({ deleted_at: new Date().toISOString(), is_published: false })
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/static-pages");
  return { ok: true };
}
