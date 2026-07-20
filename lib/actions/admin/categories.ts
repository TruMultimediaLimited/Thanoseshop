"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { categorySchema } from "@/lib/validation/admin/category";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return categorySchema.safeParse({
    name: formString(formData, "name"),
    slug: formString(formData, "slug"),
    description: formString(formData, "description"),
    imageUrl: formString(formData, "imageUrl"),
    parentId: formString(formData, "parentId"),
    sortOrder: formString(formData, "sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
}

export async function createCategory(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    image_url: parsed.data.imageUrl || null,
    parent_id: parsed.data.parentId || null,
    sort_order: parsed.data.sortOrder,
    is_published: parsed.data.isPublished,
  });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      image_url: parsed.data.imageUrl || null,
      parent_id: parsed.data.parentId || null,
      sort_order: parsed.data.sortOrder,
      is_published: parsed.data.isPublished,
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ deleted_at: new Date().toISOString(), is_published: false })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/categories");
  return { ok: true };
}
