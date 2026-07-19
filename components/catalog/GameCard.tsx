import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Game } from "@/lib/types/catalog";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <Card className="items-center gap-2 overflow-hidden p-4 text-center transition-colors group-hover:border-primary/50">
        <div className="bg-muted relative size-16 overflow-hidden rounded-xl">
          {game.logo_url ? (
            <Image
              src={game.logo_url}
              alt={game.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : null}
        </div>
        <p className="line-clamp-1 text-sm font-medium">{game.name}</p>
      </Card>
    </Link>
  );
}
