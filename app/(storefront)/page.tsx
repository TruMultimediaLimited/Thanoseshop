import type { Metadata } from "next";

import { GameCard } from "@/components/catalog/GameCard";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { EmptyState } from "@/components/common/EmptyState";
import { getFeaturedGiftCards, getGames } from "@/lib/supabase/queries/catalog";
import { getPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home");
}

export default async function Home() {
  const [games, giftCards] = await Promise.all([
    getGames({ popularOnly: true, limit: 12 }),
    getFeaturedGiftCards(12),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <section>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Popular Games</h1>
        {games.length === 0 ? (
          <EmptyState message="No games to show yet." />
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Gift Cards</h2>
        <ProductGrid products={giftCards} emptyMessage="No gift cards published yet." />
      </section>
    </div>
  );
}
