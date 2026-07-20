import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GameForm } from "@/components/admin/games/GameForm";
import { updateGame } from "@/lib/actions/admin/games";
import { createClient } from "@/lib/supabase/server";
import type { Category, Game } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "Edit Game | Admin" };

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: game }, { data: categories }] = await Promise.all([
    supabase.from("games").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").is("deleted_at", null),
  ]);

  if (!game) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Game</h1>
      <GameForm
        game={game as Game}
        categories={(categories ?? []) as Category[]}
        action={updateGame.bind(null, id)}
      />
    </div>
  );
}
