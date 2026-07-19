import { GameCard } from "@/components/catalog/GameCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import type { Game } from "@/lib/types/catalog";

export function GamesRow({
  title,
  subtitle,
  games,
}: {
  title?: string | null;
  subtitle?: string | null;
  games: Game[];
}) {
  return (
    <section>
      <SectionHeading title={title} subtitle={subtitle} />
      {games.length === 0 ? (
        <EmptyState message="No games to show yet." />
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
