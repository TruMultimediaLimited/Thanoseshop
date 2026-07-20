"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";

interface ActionResult {
  ok: boolean;
  message?: string;
}

export async function approveReview(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager", "support"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update({ status: "approved" }).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function rejectReview(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager", "support"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update({ status: "rejected" }).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/reviews");
  return { ok: true };
}
