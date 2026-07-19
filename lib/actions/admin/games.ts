"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { gameSchema } from "@/lib/validation/admin/game";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return gameSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    logoUrl: formData.get("logoUrl"),
    bannerUrl: formData.get("bannerUrl"),
    description: formData.get("description"),
    publisher: formData.get("publisher"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
    isTrending: formData.get("isTrending") === "on",
    isPopular: formData.get("isPopular") === "on",
  });
}

function toRow(data: ReturnType<typeof gameSchema.parse>) {
  return {
    name: data.name,
    slug: data.slug,
    category_id: data.categoryId || null,
    logo_url: data.logoUrl || null,
    banner_url: data.bannerUrl || null,
    description: data.description || null,
    publisher: data.publisher || null,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
    sort_order: data.sortOrder,
    is_published: data.isPublished,
    is_trending: data.isTrending,
    is_popular: data.isPopular,
  };
}

export async function createGame(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("games").insert(toRow(parsed.data));
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/games");
  redirect("/admin/games");
}

export async function updateGame(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("games").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/games");
  redirect("/admin/games");
}

export async function deleteGame(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("games")
    .update({ deleted_at: new Date().toISOString(), is_published: false })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/games");
  return { ok: true };
}
