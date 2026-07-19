"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Gamepad2,
  Gift,
  FolderTree,
  Globe,
  Users,
  Ticket,
  Star,
  HelpCircle,
  Newspaper,
  Image as ImageIcon,
  ImagePlay,
  CreditCard,
  Search,
  Settings,
  Bell,
  ScrollText,
  ShieldCheck,
  Megaphone,
  FileText,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { canAccess, type AdminRole } from "@/lib/types/admin";

const NAV = [
  {
    group: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: null }],
  },
  {
    group: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart, roles: ["order_manager"] },
      { href: "/admin/coupons", label: "Coupons", icon: Ticket, roles: ["order_manager", "product_manager"] },
      { href: "/admin/reviews", label: "Reviews", icon: Star, roles: ["product_manager", "support"] },
    ],
  },
  {
    group: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: Package, roles: ["product_manager"] },
      { href: "/admin/games", label: "Games", icon: Gamepad2, roles: ["product_manager"] },
      { href: "/admin/categories", label: "Categories", icon: FolderTree, roles: ["product_manager"] },
      { href: "/admin/regions", label: "Regions", icon: Globe, roles: ["product_manager"] },
      { href: "/admin/gift-cards", label: "Gift Cards", icon: Gift, roles: ["product_manager"] },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/homepage", label: "Homepage Manager", icon: LayoutDashboard, roles: ["product_manager"] },
      { href: "/admin/banners", label: "Banner Manager", icon: ImagePlay, roles: ["product_manager"] },
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone, roles: ["product_manager"] },
      { href: "/admin/static-pages", label: "Static Pages", icon: FileText, roles: ["product_manager"] },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, roles: ["product_manager"] },
      { href: "/admin/blog", label: "Blog", icon: Newspaper, roles: ["product_manager"] },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon, roles: ["product_manager"] },
    ],
  },
  {
    group: "People",
    items: [{ href: "/admin/users", label: "Customers & Admins", icon: Users, roles: [] }],
  },
  {
    group: "System",
    items: [
      { href: "/admin/payments", label: "Payment Methods", icon: CreditCard, roles: [] },
      { href: "/admin/seo", label: "SEO Manager", icon: Search, roles: [] },
      { href: "/admin/settings", label: "Website Settings", icon: Settings, roles: [] },
      { href: "/admin/notifications", label: "Notifications", icon: Bell, roles: null },
      { href: "/admin/activity-logs", label: "Activity Logs", icon: ScrollText, roles: [] },
    ],
  },
] satisfies {
  group: string;
  items: { href: string; label: string; icon: React.ElementType; roles: AdminRole[] | null }[];
}[];

export function AdminSidebar({ adminRole }: { adminRole: AdminRole | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 border-r px-3 py-6">
      <div className="flex items-center gap-2 px-3">
        <ShieldCheck className="text-primary size-5" />
        <span className="font-semibold">Admin Panel</span>
      </div>

      {NAV.map((group) => {
        const items = group.items.filter(
          (item) => item.roles === null || canAccess(adminRole, item.roles),
        );
        if (items.length === 0) return null;

        return (
          <div key={group.group}>
            <p className="text-muted-foreground px-3 text-xs font-semibold tracking-wide uppercase">
              {group.group}
            </p>
            <div className="mt-1 flex flex-col gap-0.5">
              {items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
          </div>
        );
      })}
    </aside>
  );
}
