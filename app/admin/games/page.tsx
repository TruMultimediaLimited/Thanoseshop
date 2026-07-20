import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteGame } from "@/lib/actions/admin/games";
import { createClient } from "@/lib/supabase/server";
import type { Game } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "Games | Admin" };

export default async function AdminGamesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("games")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const games = (data ?? []) as Game[];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Games" newHref="/admin/games/new" newLabel="New Game" />

      {games.length === 0 ? (
        <EmptyState message="No games yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell className="font-medium">{game.name}</TableCell>
                <TableCell className="text-muted-foreground">{game.slug}</TableCell>
                <TableCell className="flex gap-1">
                  {game.is_popular && <Badge variant="secondary">Popular</Badge>}
                  {game.is_trending && <Badge variant="accent">Trending</Badge>}
                </TableCell>
                <TableCell>
                  <Badge variant={game.is_published ? "default" : "secondary"}>
                    {game.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/games/${game.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteGame.bind(null, game.id)} label="game" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
