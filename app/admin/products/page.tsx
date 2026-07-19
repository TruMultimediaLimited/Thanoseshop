import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPrice } from "@/components/catalog/ProductCard";
import { deleteProduct } from "@/lib/actions/admin/products";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Products | Admin" };

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, game:games(name)")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const products = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Products" newHref="/admin/products/new" newLabel="New Product" />

      {products.length === 0 ? (
        <EmptyState message="No products yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Game</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{product.product_type}</TableCell>
                <TableCell className="text-muted-foreground">{product.game?.name ?? "—"}</TableCell>
                <TableCell>
                  {product.has_variants ? "Variants" : product.base_price ? formatPrice(product.base_price) : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={product.is_published ? "default" : "secondary"}>
                    {product.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteProduct.bind(null, product.id)} label="product" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
