import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteBanner } from "@/lib/actions/admin/banners";
import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/lib/types/content";

export const metadata: Metadata = { title: "Banner Manager | Admin" };

export default async function AdminBannersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .is("deleted_at", null)
    .order("placement")
    .order("sort_order", { ascending: true });

  const banners = (data ?? []) as Banner[];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Banner Manager" newHref="/admin/banners/new" newLabel="New Banner" />

      {banners.length === 0 ? (
        <EmptyState message="No banners yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <div className="bg-muted relative h-10 w-16 overflow-hidden rounded">
                    <Image src={banner.image_url} alt="" fill className="object-cover" unoptimized />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{banner.title ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground capitalize">
                  {banner.placement.replace("_", " ")}
                </TableCell>
                <TableCell>
                  <Badge variant={banner.is_active ? "default" : "secondary"}>
                    {banner.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/banners/${banner.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteBanner.bind(null, banner.id)} label="banner" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
