"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface VariantRow {
  id?: string;
  name: string;
  price: number | string;
  compareAtPrice: number | string | null;
  sku: string | null;
  stockQuantity: number | string | null;
  isPublished: boolean;
  sortOrder: number;
}

function isOutOfStock(value: VariantRow["stockQuantity"]) {
  return value !== null && value !== "" && Number(value) <= 0;
}

export function ProductVariantsEditor({
  variants,
  onChange,
}: {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}) {
  function update(index: number, patch: Partial<VariantRow>) {
    onChange(variants.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function remove(index: number) {
    onChange(variants.filter((_, i) => i !== index));
  }

  function add() {
    onChange([
      ...variants,
      {
        name: "",
        price: "",
        compareAtPrice: null,
        sku: null,
        stockQuantity: null,
        isPublished: true,
        sortOrder: variants.length,
      },
    ]);
  }

  return (
    <div className="flex flex-col gap-3">
      {variants.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No packages yet. Add one for each denomination (e.g. &quot;5$&quot;, &quot;60 UC&quot;).
        </p>
      )}

      {variants.map((variant, index) => (
        <div key={variant.id ?? index} className="relative rounded-lg border p-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove package"
            className="absolute top-1.5 right-1.5"
            onClick={() => remove(index)}
          >
            <Trash2 className="text-destructive size-4" />
          </Button>

          <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-4">
            <div>
              <Label className="mb-1 text-xs">Title {index + 1}</Label>
              <Input
                value={variant.name}
                onChange={(e) => update(index, { name: e.target.value })}
                placeholder="5$"
              />
            </div>
            <div>
              <Label className="mb-1 text-xs">Stock {index + 1}</Label>
              <select
                value={isOutOfStock(variant.stockQuantity) ? "out" : "available"}
                onChange={(e) =>
                  update(index, { stockQuantity: e.target.value === "out" ? 0 : null })
                }
                className="border-input h-10 w-full rounded-lg border bg-transparent px-3 text-sm outline-none"
              >
                <option value="available">Stock Available</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>
            <div>
              <Label className="mb-1 text-xs">Previous Price {index + 1}</Label>
              <Input
                type="number"
                step="0.01"
                value={variant.compareAtPrice ?? ""}
                onChange={(e) =>
                  update(index, { compareAtPrice: e.target.value === "" ? null : e.target.value })
                }
                placeholder="Optional"
              />
            </div>
            <div>
              <Label className="mb-1 text-xs">Current Price {index + 1}</Label>
              <Input
                type="number"
                step="0.01"
                value={variant.price}
                onChange={(e) => update(index, { price: e.target.value })}
                placeholder="640"
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={add}>
        <Plus /> Add Package
      </Button>
    </div>
  );
}
