"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { regionSchema } from "@/lib/validation/admin/region";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return regionSchema.safeParse({
    name: formString(formData, "name"),
    code: formString(formData, "code"),
    flagIconUrl: formString(formData, "flagIconUrl"),
    sortOrder: formString(formData, "sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function createRegion(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("regions").insert({
    name: parsed.data.name,
    code: parsed.data.code,
    flag_icon_url: parsed.data.flagIconUrl || null,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  });

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/regions");
  redirect("/admin/regions");
}

export async function updateRegion(
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
    .from("regions")
    .update({
      name: parsed.data.name,
      code: parsed.data.code,
      flag_icon_url: parsed.data.flagIconUrl || null,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/regions");
  redirect("/admin/regions");
}

export async function deleteRegion(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("regions")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/regions");
  return { ok: true };
}
