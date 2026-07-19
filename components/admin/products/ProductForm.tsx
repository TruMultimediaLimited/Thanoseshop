"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdvancedSection } from "@/components/admin/AdvancedSection";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ProductVariantsEditor, type VariantRow } from "@/components/admin/products/ProductVariantsEditor";
import type { Category, Game, ProductWithRelations, Region } from "@/lib/types/catalog";

const initialState = { ok: false, message: "" };

const PRODUCT_TYPES = [
  { value: "topup", label: "Game Top-Up" },
  { value: "giftcard", label: "Gift Card" },
  { value: "subscription", label: "Subscription" },
  { value: "account", label: "Account" },
];

const DELIVERY_TYPES = [
  { value: "manual_topup", label: "Manual Top-Up (admin fulfills)" },
  { value: "instant_code", label: "Instant Code" },
  { value: "account_credentials", label: "Account Credentials" },
];

export interface ProductFormValues {
  variants: VariantRow[];
}

export function ProductForm({
  product,
  games,
  categories,
  regions,
  action,
}: {
  product?: ProductWithRelations;
  games: Game[];
  categories: Category[];
  regions: Region[];
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(product?.thumbnail_url ?? null);
  const [productType, setProductType] = useState(product?.product_type ?? "topup");
  const [deliveryType, setDeliveryType] = useState(product?.delivery_type ?? "manual_topup");
  const [gameId, setGameId] = useState(product?.game_id ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "");
  const [regionId, setRegionId] = useState(product?.region_id ?? "");
  const [hasVariants, setHasVariants] = useState(product?.has_variants ?? false);
  const [requiresPlayerId, setRequiresPlayerId] = useState(product?.requires_player_id ?? false);
  const [isPublished, setIsPublished] = useState(product?.is_published ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isTrending, setIsTrending] = useState(product?.is_trending ?? false);
  const [isBestSeller, setIsBestSeller] = useState(product?.is_best_seller ?? false);
  const [variants, setVariants] = useState<VariantRow[]>(
    (product?.variants ?? []).map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price,
      compareAtPrice: v.compare_at_price,
      sku: v.sku,
      stockQuantity: v.stock_quantity,
      isPublished: v.is_published,
      sortOrder: v.sort_order,
    })),
  );

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-4">
      <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />

      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>
      <div>
        <Label htmlFor="slug" className="mb-2">
          Slug
        </Label>
        <Input id="slug" name="slug" defaultValue={product?.slug} required />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label className="mb-2">Product Type</Label>
          <input type="hidden" name="productType" value={productType} />
          <Select value={productType} onValueChange={(v) => setProductType(v as typeof productType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2">Game</Label>
          <input type="hidden" name="gameId" value={gameId} />
          <Select value={gameId || "none"} onValueChange={(v) => setGameId(v === "none" ? "" : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {games.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-2">Region</Label>
          <input type="hidden" name="regionId" value={regionId} />
          <Select value={regionId || "none"} onValueChange={(v) => setRegionId(v === "none" ? "" : v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None (global)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (global)</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="mb-2">Category</Label>
        <input type="hidden" name="categoryId" value={categoryId} />
        <Select value={categoryId || "none"} onValueChange={(v) => setCategoryId(v === "none" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="None" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="shortDescription" className="mb-2">
          Short Description
        </Label>
        <Input id="shortDescription" name="shortDescription" defaultValue={product?.short_description ?? ""} />
      </div>

      <div>
        <Label className="mb-2">Thumbnail</Label>
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl ?? ""} />
        <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} folder="products" />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="hasVariants" value={hasVariants ? "on" : ""} />
        <Switch checked={hasVariants} onCheckedChange={setHasVariants} id="hasVariants" />
        <Label htmlFor="hasVariants">Has multiple denominations/variants</Label>
      </div>

      {hasVariants ? (
        <ProductVariantsEditor variants={variants} onChange={setVariants} />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="basePrice" className="mb-2">
              Price
            </Label>
            <Input id="basePrice" name="basePrice" type="number" step="0.01" defaultValue={product?.base_price ?? ""} />
          </div>
          <div>
            <Label htmlFor="stockQuantity" className="mb-2">
              Stock (leave blank for unlimited)
            </Label>
            <Input id="stockQuantity" name="stockQuantity" type="number" defaultValue={product?.stock_quantity ?? ""} />
          </div>
        </div>
      )}

      <div>
        <Label className="mb-2">Delivery Type</Label>
        <input type="hidden" name="deliveryType" value={deliveryType} />
        <Select value={deliveryType} onValueChange={(v) => setDeliveryType(v as typeof deliveryType)}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DELIVERY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="deliveryInstructions" className="mb-2">
          Delivery Instructions (shown to customer)
        </Label>
        <Textarea
          id="deliveryInstructions"
          name="deliveryInstructions"
          defaultValue={product?.delivery_instructions ?? ""}
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="requiresPlayerId" value={requiresPlayerId ? "on" : ""} />
        <Switch checked={requiresPlayerId} onCheckedChange={setRequiresPlayerId} id="requiresPlayerId" />
        <Label htmlFor="requiresPlayerId">Requires Player ID / UID at checkout</Label>
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
        <Switch checked={isPublished} onCheckedChange={setIsPublished} id="isPublished" />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      <AdvancedSection>
        <div>
          <Label htmlFor="description" className="mb-2">
            Description
          </Label>
          <Textarea id="description" name="description" defaultValue={product?.description ?? ""} rows={4} />
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input type="hidden" name="isFeatured" value={isFeatured ? "on" : ""} />
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} id="isFeatured" />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="hidden" name="isTrending" value={isTrending ? "on" : ""} />
            <Switch checked={isTrending} onCheckedChange={setIsTrending} id="isTrending" />
            <Label htmlFor="isTrending">Trending</Label>
          </div>
          <div className="flex items-center gap-2">
            <input type="hidden" name="isBestSeller" value={isBestSeller ? "on" : ""} />
            <Switch checked={isBestSeller} onCheckedChange={setIsBestSeller} id="isBestSeller" />
            <Label htmlFor="isBestSeller">Best Seller</Label>
          </div>
        </div>

        <div>
          <Label htmlFor="sortOrder" className="mb-2">
            Sort Order
          </Label>
          <Input id="sortOrder" name="sortOrder" type="number" defaultValue={product?.sort_order ?? 0} className="w-32" />
        </div>

        <div>
          <Label htmlFor="metaTitle" className="mb-2">
            Meta Title
          </Label>
          <Input id="metaTitle" name="metaTitle" defaultValue={product?.meta_title ?? ""} />
        </div>
        <div>
          <Label htmlFor="metaDescription" className="mb-2">
            Meta Description
          </Label>
          <Textarea id="metaDescription" name="metaDescription" defaultValue={product?.meta_description ?? ""} />
        </div>
      </AdvancedSection>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Product"}
      </Button>
    </form>
  );
}
