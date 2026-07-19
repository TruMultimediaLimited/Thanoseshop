"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { faqSchema } from "@/lib/validation/admin/faq";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return faqSchema.safeParse({
    question: formString(formData, "question"),
    answer: formString(formData, "answer"),
    productId: formString(formData, "productId"),
    sortOrder: formString(formData, "sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
}

function toRow(data: ReturnType<typeof faqSchema.parse>) {
  return {
    question: data.question,
    answer: data.answer,
    product_id: data.productId || null,
    sort_order: data.sortOrder,
    is_published: data.isPublished,
  };
}

export async function createFaq(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").insert(toRow(parsed.data));
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function updateFaq(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("faqs")
    .update({ deleted_at: new Date().toISOString(), is_published: false })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/faqs");
  return { ok: true };
}
