import "server-only";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types/admin";

/**
 * Authoritative admin gate for Server Components / Server Actions. RLS
 * (is_admin()) is the real security boundary — this exists for UX (redirect
 * instead of a raw RLS error) and to expose admin_role for nav/UI gating.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, admin_role, full_name, is_active")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    redirect("/");
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    fullName: profile.full_name as string | null,
    adminRole: profile.admin_role as AdminRole | null,
  };
}
