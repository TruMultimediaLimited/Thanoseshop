"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { paymentMethodSchema } from "@/lib/validation/admin/payment-method";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return paymentMethodSchema.safeParse({
    name: formString(formData, "name"),
    type: formString(formData, "type"),
    accountNumber: formString(formData, "accountNumber"),
    accountName: formString(formData, "accountName"),
    bankName: formString(formData, "bankName"),
    branch: formString(formData, "branch"),
    routingNumber: formString(formData, "routingNumber"),
    instructions: formString(formData, "instructions"),
    sortOrder: formString(formData, "sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

function toRow(data: ReturnType<typeof paymentMethodSchema.parse>) {
  return {
    name: data.name,
    type: data.type,
    account_number: data.accountNumber || null,
    account_name: data.accountName || null,
    bank_name: data.bankName || null,
    branch: data.branch || null,
    routing_number: data.routingNumber || null,
    instructions: data.instructions || null,
    sort_order: data.sortOrder,
    is_active: data.isActive,
  };
}

export async function createPaymentMethod(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole([]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("payment_methods").insert(toRow(parsed.data));
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/payments");
  redirect("/admin/payments");
}

export async function updatePaymentMethod(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole([]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("payment_methods").update(toRow(parsed.data)).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/payments");
  redirect("/admin/payments");
}

export async function deletePaymentMethod(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole([]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("payment_methods").update({ is_active: false }).eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/payments");
  return { ok: true };
}
