"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { homepageSectionSchema } from "@/lib/validation/admin/homepage-section";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return homepageSectionSchema.safeParse({
    sectionType: formData.get("sectionType"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    configJson: formData.get("configJson"),
    isActive: formData.get("isActive") === "on",
  });
}

function toRow(data: ReturnType<typeof homepageSectionSchema.parse>) {
  return {
    section_type: data.sectionType,
    title: data.title || null,
    subtitle: data.subtitle || null,
    config: data.configJson ? JSON.parse(data.configJson) : {},
    is_active: data.isActive,
  };
}

export async function createHomepageSection(
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { count } = await supabase.from("homepage_sections").select("id", { count: "exact", head: true });

  const { error } = await supabase
    .from("homepage_sections")
    .insert({ ...toRow(parsed.data), sort_order: count ?? 0 });
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  redirect("/admin/homepage");
}

export async function updateHomepageSection(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("homepage_sections").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  redirect("/admin/homepage");
}

export async function deleteHomepageSection(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("homepage_sections").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}

export async function moveHomepageSection(id: string, direction: "up" | "down"): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { data: sections } = await supabase
    .from("homepage_sections")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (!sections) return { ok: false, message: "Could not load sections." };

  const index = sections.findIndex((s) => s.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sections.length) return { ok: true };

  const current = sections[index];
  const target = sections[swapWith];

  await Promise.all([
    supabase.from("homepage_sections").update({ sort_order: target.sort_order }).eq("id", current.id),
    supabase.from("homepage_sections").update({ sort_order: current.sort_order }).eq("id", target.id),
  ]);

  revalidatePath("/admin/homepage");
  revalidatePath("/");
  return { ok: true };
}
