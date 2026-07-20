"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { announcementSchema } from "@/lib/validation/admin/announcement";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return announcementSchema.safeParse({
    message: formString(formData, "message"),
    linkUrl: formString(formData, "linkUrl"),
    isActive: formData.get("isActive") === "on",
    startsAt: formString(formData, "startsAt"),
    endsAt: formString(formData, "endsAt"),
    sortOrder: formString(formData, "sortOrder"),
  });
}

function toRow(data: ReturnType<typeof announcementSchema.parse>) {
  return {
    message: data.message,
    link_url: data.linkUrl || null,
    is_active: data.isActive,
    starts_at: data.startsAt ? new Date(data.startsAt).toISOString() : null,
    ends_at: data.endsAt ? new Date(data.endsAt).toISOString() : null,
    sort_order: data.sortOrder,
  };
}

export async function createAnnouncement(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert(toRow(parsed.data));
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
  redirect("/admin/announcements");
}

export async function updateAnnouncement(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
  redirect("/admin/announcements");
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/announcements");
  revalidatePath("/", "layout");
  return { ok: true };
}
