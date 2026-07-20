import type { Metadata } from "next";

import { GameForm } from "@/components/admin/games/GameForm";
import { createGame } from "@/lib/actions/admin/games";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "New Game | Admin" };

export default async function NewGamePage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").is("deleted_at", null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Game</h1>
      <GameForm categories={(data ?? []) as Category[]} action={createGame} />
    </div>
  );
}
