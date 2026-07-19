import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteRegion } from "@/lib/actions/admin/regions";
import { createClient } from "@/lib/supabase/server";
import type { Region } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "Regions | Admin" };

export default async function AdminRegionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("regions")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const regions = (data ?? []) as Region[];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Regions" newHref="/admin/regions/new" newLabel="New Region" />

      {regions.length === 0 ? (
        <EmptyState message="No regions yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regions.map((region) => (
              <TableRow key={region.id}>
                <TableCell className="font-medium">{region.name}</TableCell>
                <TableCell className="text-muted-foreground">{region.code}</TableCell>
                <TableCell>
                  <Badge variant={region.is_active ? "default" : "secondary"}>
                    {region.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/regions/${region.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteRegion.bind(null, region.id)} label="region" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
