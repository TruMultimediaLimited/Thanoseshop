"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Gamepad2,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  Package,
  PlusCircle,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  User,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { canAccess, type AdminRole } from "@/lib/types/admin";

/**
 * Deliberately a short, flat list — the owner's request. Less-used sections
 * (coupons, categories, regions, blog, media, homepage manager, SEO, logs,
 * static pages, gift-card view) keep their routes and still work by URL;
 * they are just not in the menu.
 */
const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: null, exact: true },
  { href: "/admin/orders", label: "Order List", icon: ShoppingCart, roles: ["order_manager"] },
  { href: "/admin/products/new", label: "Add New Product", icon: PlusCircle, roles: ["product_manager"], exact: true },
  { href: "/admin/products", label: "Manage Products", icon: Package, roles: ["product_manager"] },
  { href: "/admin/games", label: "Manage Games", icon: Gamepad2, roles: ["product_manager"] },
  { href: "/admin/announcements", label: "Manage Notice", icon: Megaphone, roles: ["product_manager"] },
  { href: "/admin/faqs", label: "Manage FAQ", icon: HelpCircle, roles: ["product_manager"] },
  { href: "/admin/reviews", label: "Manage Reviews", icon: Star, roles: ["product_manager", "support"] },
  { href: "/admin/users", label: "Manage Users", icon: Users, roles: [] },
  { href: "/admin/payments", label: "Payment Methods", icon: CreditCard, roles: [] },
  { href: "/admin/settings", label: "Site Settings", icon: Settings, roles: [] },
  { href: "/account", label: "My Profile", icon: User, roles: null },
] satisfies {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: AdminRole[] | null;
  exact?: boolean;
}[];

export function AdminNavLinks({
  adminRole,
  onNavigate,
}: {
  adminRole: AdminRole | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-0.5">
      {NAV.filter((item) => item.roles === null || canAccess(adminRole, item.roles)).map((item) => {
        const active =
          "exact" in item && item.exact
            ? pathname === item.href
            : (pathname === item.href || pathname.startsWith(`${item.href}/`)) &&
              !(item.href === "/admin/products" && pathname.startsWith("/admin/products/new"));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

export function AdminSidebar({ adminRole }: { adminRole: AdminRole | null }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col gap-4 border-r px-3 py-6 lg:flex">
      <div className="flex items-center gap-2 px-3">
        <ShieldCheck className="text-primary size-5" />
        <span className="font-semibold">Admin Panel</span>
      </div>
      <AdminNavLinks adminRole={adminRole} />
    </aside>
  );
}
