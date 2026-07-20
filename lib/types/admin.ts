export type AdminRole = "super_admin" | "order_manager" | "product_manager" | "support";

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  order_manager: "Order Manager",
  product_manager: "Product Manager",
  support: "Support",
};

// Pure — safe to import from client components (unlike admin-guard.ts,
// which pulls in "server-only" via the Supabase server client).
export function canAccess(adminRole: AdminRole | null, allowed: AdminRole[]) {
  if (adminRole === "super_admin") return true;
  return adminRole ? allowed.includes(adminRole) : false;
}
