"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Archive, Copy, Download, Eye, EyeOff, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatPrice } from "@/components/catalog/ProductCard";
import {
  bulkArchiveProducts,
  bulkSetProductsPublished,
  deleteProduct,
  duplicateProduct,
} from "@/lib/actions/admin/products";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  product_type: string;
  game_name: string | null;
  base_price: number | null;
  compare_at_price: number | null;
  has_variants: boolean;
  stock_quantity: number | null;
  is_published: boolean;
}

function toCsv(rows: ProductRow[]) {
  const escape = (value: unknown) => {
    const text = value == null ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const header = [
    "name", "slug", "type", "game", "base_price", "compare_at_price",
    "has_variants", "stock_quantity", "published",
  ];
  const lines = rows.map((row) =>
    [
      row.name, row.slug, row.product_type, row.game_name ?? "",
      row.base_price ?? "", row.compare_at_price ?? "",
      row.has_variants, row.stock_quantity ?? "", row.is_published,
    ].map(escape).join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

export function ProductsTable({ products, showGame = true }: { products: ProductRow[]; showGame?: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const allSelected = products.length > 0 && selected.size === products.length;
  const ids = [...selected];

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function runBulk(action: () => Promise<{ ok: boolean; message?: string }>, successMessage: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong");
        return;
      }
      toast.success(successMessage);
      setSelected(new Set());
      router.refresh();
    });
  }

  function handleDuplicate() {
    const id = ids[0];
    startTransition(async () => {
      const result = await duplicateProduct(id);
      if (!result.ok || !result.newId) {
        toast.error(result.message ?? "Could not duplicate");
        return;
      }
      toast.success("Duplicated as a draft — now editing the copy");
      router.push(`/admin/products/${result.newId}/edit`);
    });
  }

  function handleExport() {
    const rows = selected.size > 0 ? products.filter((p) => selected.has(p.id)) : products;
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-h-9 flex-wrap items-center gap-2">
        {selected.size > 0 ? (
          <>
            <span className="text-muted-foreground mr-1 text-sm">{selected.size} selected</span>
            <Button
              variant="secondary" size="sm" disabled={isPending}
              onClick={() => runBulk(() => bulkSetProductsPublished(ids, true), "Published")}
            >
              <Eye /> Publish
            </Button>
            <Button
              variant="secondary" size="sm" disabled={isPending}
              onClick={() => runBulk(() => bulkSetProductsPublished(ids, false), "Unpublished")}
            >
              <EyeOff /> Unpublish
            </Button>
            <Button
              variant="secondary" size="sm" disabled={isPending}
              onClick={() => runBulk(() => bulkArchiveProducts(ids), "Archived")}
            >
              <Archive /> Archive
            </Button>
            {selected.size === 1 && (
              <Button variant="secondary" size="sm" disabled={isPending} onClick={handleDuplicate}>
                <Copy /> Duplicate
              </Button>
            )}
          </>
        ) : (
          <span className="text-muted-foreground text-sm">
            Select rows for bulk actions, or export everything.
          </span>
        )}
        <Button variant="outline" size="sm" className="ml-auto" onClick={handleExport}>
          <Download /> Export CSV
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <input
                type="checkbox"
                aria-label="Select all products"
                className="accent-primary size-4 align-middle"
                checked={allSelected}
                onChange={() =>
                  setSelected(allSelected ? new Set() : new Set(products.map((p) => p.id)))
                }
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            {showGame && <TableHead>Game</TableHead>}
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} data-state={selected.has(product.id) ? "selected" : undefined}>
              <TableCell>
                <input
                  type="checkbox"
                  aria-label={`Select ${product.name}`}
                  className="accent-primary size-4 align-middle"
                  checked={selected.has(product.id)}
                  onChange={() => toggle(product.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-muted-foreground capitalize">{product.product_type}</TableCell>
              {showGame && (
                <TableCell className="text-muted-foreground">{product.game_name ?? "—"}</TableCell>
              )}
              <TableCell>
                {product.has_variants
                  ? "Variants"
                  : product.base_price != null
                    ? formatPrice(product.base_price)
                    : "—"}
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
                <DeleteButton action={() => deleteProduct(product.id)} label="product" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
