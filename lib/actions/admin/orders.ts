"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function requireOrderManager() {
  return requireAdminRole(["order_manager"]);
}

export async function verifyPayment(orderId: string): Promise<ActionResult> {
  const gate = await requireOrderManager();
  if (!gate.ok) return gate;

  const supabase = await createClient();

  const { error: submissionError } = await supabase
    .from("payment_submissions")
    .update({ status: "verified", reviewed_by: gate.admin.userId, reviewed_at: new Date().toISOString() })
    .eq("order_id", orderId);
  if (submissionError) return { ok: false, message: submissionError.message };

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId);
  if (orderError) return { ok: false, message: orderError.message };

  await supabase.from("audit_logs").insert({
    actor_id: gate.admin.userId,
    action: "order.payment_verified",
    entity_type: "order",
    entity_id: orderId,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function rejectPayment(orderId: string, reason: string): Promise<ActionResult> {
  const gate = await requireOrderManager();
  if (!gate.ok) return gate;
  if (!reason.trim()) return { ok: false, message: "A rejection reason is required." };

  const supabase = await createClient();

  const { error: submissionError } = await supabase
    .from("payment_submissions")
    .update({
      status: "rejected",
      rejection_reason: reason.trim(),
      reviewed_by: gate.admin.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("order_id", orderId);
  if (submissionError) return { ok: false, message: submissionError.message };

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);
  if (orderError) return { ok: false, message: orderError.message };

  await supabase.from("audit_logs").insert({
    actor_id: gate.admin.userId,
    action: "order.payment_rejected",
    entity_type: "order",
    entity_id: orderId,
    metadata: { reason: reason.trim() },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function startProcessing(orderId: string): Promise<ActionResult> {
  const gate = await requireOrderManager();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status: "processing" }).eq("id", orderId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function deliverOrderItem(
  orderItemId: string,
  orderId: string,
  payload: string,
): Promise<ActionResult> {
  const gate = await requireOrderManager();
  if (!gate.ok) return gate;
  if (!payload.trim()) return { ok: false, message: "Enter the code/credentials to deliver." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("order_items")
    .update({ delivered_payload: payload.trim(), delivered_at: new Date().toISOString() })
    .eq("id", orderItemId);
  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}

export async function markOrderCompleted(orderId: string): Promise<ActionResult> {
  const gate = await requireOrderManager();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status: "completed" }).eq("id", orderId);
  if (error) return { ok: false, message: error.message };

  await supabase.from("audit_logs").insert({
    actor_id: gate.admin.userId,
    action: "order.completed",
    entity_type: "order",
    entity_id: orderId,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account/orders");
  return { ok: true };
}

export async function refundOrder(orderId: string): Promise<ActionResult> {
  const gate = await requireOrderManager();
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status: "refunded" }).eq("id", orderId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { ok: true };
}
