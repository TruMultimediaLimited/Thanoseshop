import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteCoupon } from "@/lib/actions/admin/coupons";
import { createClient } from "@/lib/supabase/server";
import type { Coupon } from "@/lib/types/commerce";

export const metadata: Metadata = { title: "Coupons | Admin" };

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coupons")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const coupons = (data ?? []) as Coupon[];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Coupons" newHref="/admin/coupons/new" newLabel="New Coupon" />

      {coupons.length === 0 ? (
        <EmptyState message="No coupons yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                <TableCell>
                  {coupon.discount_type === "percent"
                    ? `${coupon.discount_value}%`
                    : `৳${coupon.discount_value}`}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {coupon.used_count}
                  {coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.is_active ? "default" : "secondary"}>
                    {coupon.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/coupons/${coupon.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteCoupon.bind(null, coupon.id)} label="coupon" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
