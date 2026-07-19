"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import type { AdminRole } from "@/lib/types/admin";

interface ActionResult {
  ok: boolean;
  message?: string;
}

export async function setUserRole(
  userId: string,
  role: "customer" | "admin",
  adminRole: AdminRole | null,
): Promise<ActionResult> {
  const gate = await requireAdminRole([]);
  if (!gate.ok) return gate;

  if (userId === gate.admin.userId && role === "customer") {
    return { ok: false, message: "You can't remove your own admin access." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role, admin_role: role === "admin" ? adminRole : null })
    .eq("id", userId);

  if (error) return { ok: false, message: error.message };

  await supabase.from("audit_logs").insert({
    actor_id: gate.admin.userId,
    action: "user.role_changed",
    entity_type: "profile",
    entity_id: userId,
    metadata: { role, admin_role: adminRole },
  });

  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserActive(userId: string, isActive: boolean): Promise<ActionResult> {
  const gate = await requireAdminRole([]);
  if (!gate.ok) return gate;

  if (userId === gate.admin.userId && !isActive) {
    return { ok: false, message: "You can't deactivate your own account." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", userId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/users");
  return { ok: true };
}
