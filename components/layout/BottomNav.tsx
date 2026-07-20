"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, Home, ShoppingCart, User } from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="border-border/60 bg-card/75 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-4">
        {TABS.map((tab) => {
          const active =
            tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <tab.icon className="size-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
