import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBarSection({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  return (
    <div className="bg-card flex flex-col items-center gap-3 rounded-2xl border px-6 py-10 text-center">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title ?? "What are you topping up today?"}
      </h2>
      {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      <form action="/products" className="mt-2 flex w-full max-w-lg gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            name="q"
            placeholder="Search for a game, gift card..."
            className="h-11 pl-9"
          />
        </div>
        <Button type="submit" size="lg" className="h-11">
          Search
        </Button>
      </form>
    </div>
  );
}
