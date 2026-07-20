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

export function BottomNav({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#161a28]/90 backdrop-blur-md">
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
                active ? "text-primary" : "text-white/60 hover:text-white",
              )}
            >
              <span className="relative">
                <tab.icon className="size-5" />
                {tab.href === "/cart" && cartCount > 0 && (
                  <span className="bg-primary text-primary-foreground absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
