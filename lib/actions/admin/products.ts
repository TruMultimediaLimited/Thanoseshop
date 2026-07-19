"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { productSchema } from "@/lib/validation/admin/product";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  let variants: unknown[] = [];
  try {
    variants = JSON.parse((formData.get("variantsJson") as string) || "[]");
  } catch {
    variants = [];
  }

  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    productType: formData.get("productType"),
    gameId: formData.get("gameId"),
    categoryId: formData.get("categoryId"),
    regionId: formData.get("regionId"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    basePrice: formData.get("basePrice"),
    hasVariants: formData.get("hasVariants") === "on",
    deliveryType: formData.get("deliveryType"),
    deliveryInstructions: formData.get("deliveryInstructions"),
    requiresPlayerId: formData.get("requiresPlayerId") === "on",
    stockQuantity: formData.get("stockQuantity"),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isTrending: formData.get("isTrending") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    sortOrder: formData.get("sortOrder"),
    variants,
  });
}

function toProductRow(data: ReturnType<typeof productSchema.parse>) {
  return {
    name: data.name,
    slug: data.slug,
    product_type: data.productType,
    game_id: data.gameId || null,
    category_id: data.categoryId || null,
    region_id: data.regionId || null,
    description: data.description || null,
    short_description: data.shortDescription || null,
    thumbnail_url: data.thumbnailUrl || null,
    base_price: data.hasVariants ? null : data.basePrice ? Number(data.basePrice) : null,
    has_variants: data.hasVariants,
    delivery_type: data.deliveryType,
    delivery_instructions: data.deliveryInstructions || null,
    requires_player_id: data.requiresPlayerId,
    stock_quantity: data.stockQuantity ? Number(data.stockQuantity) : null,
    is_published: data.isPublished,
    is_featured: data.isFeatured,
    is_trending: data.isTrending,
    is_best_seller: data.isBestSeller,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
    sort_order: data.sortOrder,
  };
}

/**
 * Variants are never hard-deleted here: product_variants.id is referenced
 * by order_items with no ON DELETE clause (defaults to NO ACTION), so
 * deleting a variant that has ever been ordered would fail outright.
 * Removed-from-form variants are soft-deleted instead, matching the
 * deleted_at convention used everywhere else in the catalog.
 */
async function syncVariants(
  supabase: Awaited<ReturnType<typeof createClient>>,
  productId: string,
  variants: ReturnType<typeof productSchema.parse>["variants"],
) {
  const { data: existing } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId)
    .is("deleted_at", null);

  const existingIds = new Set((existing ?? []).map((v) => v.id as string));
  const submittedIds = new Set(variants.filter((v) => v.id).map((v) => v.id as string));

  const toRemove = [...existingIds].filter((id) => !submittedIds.has(id));
  if (toRemove.length > 0) {
    await supabase
      .from("product_variants")
      .update({ deleted_at: new Date().toISOString(), is_published: false })
      .in("id", toRemove);
  }

  for (const variant of variants) {
    const row = {
      product_id: productId,
      name: variant.name,
      price: variant.price,
      compare_at_price: variant.compareAtPrice || null,
      sku: variant.sku || null,
      stock_quantity: variant.stockQuantity ?? null,
      is_published: variant.isPublished,
      sort_order: variant.sortOrder,
    };

    if (variant.id && existingIds.has(variant.id)) {
      await supabase.from("product_variants").update(row).eq("id", variant.id);
    } else {
      await supabase.from("product_variants").insert(row);
    }
  }
}

export async function createProduct(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .insert(toProductRow(parsed.data))
    .select("id")
    .single();

  if (error) {
    return { ok: false, message: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  if (parsed.data.hasVariants && parsed.data.variants.length > 0) {
    await syncVariants(supabase, product.id, parsed.data.variants);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.from("products").update(toProductRow(parsed.data)).eq("id", id);

  if (error) {
    return { ok: false, message: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await syncVariants(supabase, id, parsed.data.hasVariants ? parsed.data.variants : []);

  revalidatePath("/admin/products");
  revalidatePath(`/products/${parsed.data.slug}`);
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), is_published: false })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/products");
  return { ok: true };
}
