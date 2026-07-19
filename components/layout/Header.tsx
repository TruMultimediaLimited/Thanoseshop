import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MobileNav } from "@/components/layout/MobileNav";
import { UserMenu } from "@/components/layout/UserMenu";
import { createClient } from "@/lib/supabase/server";
import { getCategories, getGames } from "@/lib/supabase/queries/catalog";
import { getSiteSettings } from "@/lib/supabase/queries/settings";

export async function Header() {
  const supabase = await createClient();
  const [categories, games, settings, { data: { user } }] = await Promise.all([
    getCategories(),
    getGames({ popularOnly: true, limit: 8 }),
    getSiteSettings(),
    supabase.auth.getUser(),
  ]);

  const profile = user
    ? (
        await supabase
          .from("profiles")
          .select("full_name, role")
          .eq("id", user.id)
          .single()
      ).data
    : null;

  const siteName = settings?.site_name ?? "Thanos E-Shop";

  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <MobileNav categories={categories} games={games} siteName={siteName} />

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/products"
            className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            All Products
          </Link>
          <Link
            href="/gift-cards"
            className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            Gift Cards
          </Link>
          {games.slice(0, 4).map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug}`}
              className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              {game.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <form
            action="/products"
            className="relative hidden w-64 lg:block"
          >
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              name="q"
              placeholder="Search games, gift cards..."
              className="pl-8"
            />
          </form>

          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart />
            </Button>
          </Link>

          {user ? (
            <UserMenu
              fullName={profile?.full_name ?? null}
              email={user.email ?? ""}
              isAdmin={profile?.role === "admin"}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/register">
                <Button>Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
