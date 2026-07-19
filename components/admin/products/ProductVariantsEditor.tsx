"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
          No variants yet. Add one for each denomination (e.g. &quot;60 UC&quot;, &quot;325 UC&quot;).
        </p>
      )}

      {variants.map((variant, index) => (
        <div key={variant.id ?? index} className="grid grid-cols-1 gap-2 rounded-lg border p-3 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <Label className="mb-1 text-xs">Name</Label>
            <Input
              value={variant.name}
              onChange={(e) => update(index, { name: e.target.value })}
              placeholder="60 UC"
            />
          </div>
          <div>
            <Label className="mb-1 text-xs">Price</Label>
            <Input
              type="number"
              step="0.01"
              value={variant.price}
              onChange={(e) => update(index, { price: e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-1 text-xs">Compare-at</Label>
            <Input
              type="number"
              step="0.01"
              value={variant.compareAtPrice ?? ""}
              onChange={(e) => update(index, { compareAtPrice: e.target.value === "" ? null : e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-1 text-xs">Stock</Label>
            <Input
              type="number"
              value={variant.stockQuantity ?? ""}
              onChange={(e) => update(index, { stockQuantity: e.target.value === "" ? null : e.target.value })}
              placeholder="∞"
            />
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Switch
                checked={variant.isPublished}
                onCheckedChange={(v) => update(index, { isPublished: v })}
              />
              <Label className="text-xs">On</Label>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="text-destructive size-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" className="w-fit" onClick={add}>
        <Plus /> Add Variant
      </Button>
    </div>
  );
}
