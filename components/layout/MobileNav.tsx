"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/lib/types/catalog";
import type { Game } from "@/lib/types/catalog";

export function MobileNav({
  categories,
  games,
  siteName,
}: {
  categories: Category[];
  games: Game[];
  siteName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>{siteName}</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 overflow-y-auto px-4 pb-6">
          <Link
            href="/products"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={() => setOpen(false)}
          >
            All Products
          </Link>
          <Link
            href="/gift-cards"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            onClick={() => setOpen(false)}
          >
            Gift Cards
          </Link>

          {games.length > 0 && (
            <div className="mt-4">
              <p className="text-muted-foreground px-3 text-xs font-semibold tracking-wide uppercase">
                Popular Games
              </p>
              {games.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.slug}`}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground block"
                  onClick={() => setOpen(false)}
                >
                  {game.name}
                </Link>
              ))}
            </div>
          )}

          {categories.length > 0 && (
            <div className="mt-4">
              <p className="text-muted-foreground px-3 text-xs font-semibold tracking-wide uppercase">
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground block"
                  onClick={() => setOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 border-t pt-4">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                Log in
              </Button>
            </Link>
            <Link href="/register" onClick={() => setOpen(false)}>
              <Button className="w-full">Sign up</Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
