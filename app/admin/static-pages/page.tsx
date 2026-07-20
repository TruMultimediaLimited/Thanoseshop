import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteStaticPage } from "@/lib/actions/admin/static-pages";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Static Pages | Admin" };

export default async function AdminStaticPagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("static_pages")
    .select("*")
    .is("deleted_at", null)
    .order("title", { ascending: true });

  const pages = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Static Pages" newHref="/admin/static-pages/new" newLabel="New Page" />

      {pages.length === 0 ? (
        <EmptyState message="No static pages yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  /pages/{page.slug}
                </TableCell>
                <TableCell>
                  <Badge variant={page.is_published ? "default" : "secondary"}>
                    {page.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/static-pages/${page.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteStaticPage.bind(null, page.id)} label="page" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
