import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, Package, ShieldCheck, User } from "lucide-react";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { createClient } from "@/lib/supabase/server";

const NAV_ITEMS = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="flex shrink-0 flex-col gap-1 lg:w-56">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}

        {profile?.role === "admin" && (
          <>
            <div className="my-2 border-t" />
            <Link
              href="/admin"
              className="text-primary hover:bg-accent flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
            >
              <ShieldCheck className="size-4" />
              Admin Panel
            </Link>
          </>
        )}

        <SignOutButton />
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
