import Image from "next/image";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Game } from "@/lib/types/catalog";

export function GameCard({ game }: { game: Game }) {
  const image = game.banner_url ?? game.logo_url;

  return (
    <Link href={`/games/${game.slug}`} className="group block">
      <Card className="overflow-hidden gap-0 py-0 transition-colors group-hover:border-primary/50">
        <div className="bg-muted relative aspect-3/4 w-full overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={game.name}
              fill
              sizes="(min-width: 1024px) 12vw, (min-width: 640px) 20vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center">
              <Gamepad2 className="size-8" />
            </div>
          )}
          <span className="bg-primary text-primary-foreground absolute top-2 right-2 flex size-7 items-center justify-center rounded-full shadow-sm">
            <Gamepad2 className="size-3.5" />
          </span>
        </div>
        <div className="p-2.5">
          <p className="line-clamp-1 text-sm font-semibold">{game.name}</p>
        </div>
      </Card>
    </Link>
  );
}
