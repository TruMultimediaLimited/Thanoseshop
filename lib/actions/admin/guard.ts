import "server-only";

import { requireAdmin } from "@/lib/supabase/admin-guard";
import { canAccess, type AdminRole } from "@/lib/types/admin";

/**
 * Shared entry point for every admin server action: confirms the caller is
 * an admin (redirects otherwise) and that their fixed admin_role is allowed
 * to perform this class of action. RLS is still the real security
 * boundary — this exists so the wrong-role UI failure is a clean message
 * instead of a raw Postgres/RLS error.
 */
export async function requireAdminRole(allowed: AdminRole[]) {
  const admin = await requireAdmin();
  if (!canAccess(admin.adminRole, allowed)) {
    return { ok: false as const, message: "You don't have permission to do this." };
  }
  return { ok: true as const, admin };
}
