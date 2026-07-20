"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { formString } from "@/lib/actions/admin/form";
import { productSchema } from "@/lib/validation/admin/product";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseJsonArray(raw: string): unknown[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseForm(formData: FormData) {
  const variants = parseJsonArray(formString(formData, "variantsJson"));
  const gallery = parseJsonArray(formString(formData, "galleryJson"));

  return productSchema.safeParse({
    name: formString(formData, "name"),
    slug: formString(formData, "slug"),
    productType: formString(formData, "productType"),
    gameId: formString(formData, "gameId"),
    categoryId: formString(formData, "categoryId"),
    regionId: formString(formData, "regionId"),
    description: formString(formData, "description"),
    shortDescription: formString(formData, "shortDescription"),
    thumbnailUrl: formString(formData, "thumbnailUrl"),
    gallery,
    basePrice: formString(formData, "basePrice"),
    compareAtPrice: formString(formData, "compareAtPrice"),
    hasVariants: formData.get("hasVariants") === "on",
    deliveryType: formString(formData, "deliveryType"),
    deliveryInstructions: formString(formData, "deliveryInstructions"),
    requiresPlayerId: formData.get("requiresPlayerId") === "on",
    stockQuantity: formString(formData, "stockQuantity"),
    isPublished: formData.get("isPublished") === "on",
    isFeatured: formData.get("isFeatured") === "on",
    isTrending: formData.get("isTrending") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    metaTitle: formString(formData, "metaTitle"),
    metaDescription: formString(formData, "metaDescription"),
    sortOrder: formString(formData, "sortOrder"),
    variants,
  });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveSlug(data: ReturnType<typeof productSchema.parse>) {
  return data.slug || slugify(data.name) || `product-${Date.now().toString(36)}`;
}

function toProductRow(data: ReturnType<typeof productSchema.parse>, slug: string) {
  return {
    name: data.name,
    slug,
    product_type: data.productType,
    game_id: data.gameId || null,
    category_id: data.categoryId || null,
    region_id: data.regionId || null,
    description: data.description || null,
    short_description: data.shortDescription || null,
    thumbnail_url: data.thumbnailUrl || null,
    gallery: data.gallery,
    base_price: data.hasVariants ? null : data.basePrice ? Number(data.basePrice) : null,
    compare_at_price: data.hasVariants ? null : data.compareAtPrice ? Number(data.compareAtPrice) : null,
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
  const slug = resolveSlug(parsed.data);
  let { data: product, error } = await supabase
    .from("products")
    .insert(toProductRow(parsed.data, slug))
    .select("id")
    .single();

  // An auto-generated slug colliding isn't the admin's fault — retry with a
  // unique suffix instead of surfacing an error they didn't cause.
  if (error?.code === "23505" && !parsed.data.slug) {
    ({ data: product, error } = await supabase
      .from("products")
      .insert(toProductRow(parsed.data, `${slug}-${Date.now().toString(36)}`))
      .select("id")
      .single());
  }

  if (error || !product) {
    return {
      ok: false,
      message: error?.code === "23505" ? "That slug is already in use." : (error?.message ?? "Could not create the product."),
    };
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
  const slug = resolveSlug(parsed.data);
  const { error } = await supabase.from("products").update(toProductRow(parsed.data, slug)).eq("id", id);

  if (error) {
    return { ok: false, message: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  await syncVariants(supabase, id, parsed.data.hasVariants ? parsed.data.variants : []);

  revalidatePath("/admin/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export async function duplicateProduct(id: string): Promise<ActionResult & { newId?: string }> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const [{ data: product }, { data: variants }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_variants").select("*").eq("product_id", id).is("deleted_at", null),
  ]);
  if (!product) return { ok: false, message: "Product not found." };

  const {
    id: _id,
    created_at: _created,
    updated_at: _updated,
    deleted_at: _deleted,
    ...copy
  } = product;

  // Copies start as drafts so an accidental duplicate never goes live.
  const baseRow = { ...copy, name: `${product.name} (Copy)`, is_published: false };

  let inserted = await supabase
    .from("products")
    .insert({ ...baseRow, slug: `${product.slug}-copy` })
    .select("id")
    .single();

  if (inserted.error?.code === "23505") {
    inserted = await supabase
      .from("products")
      .insert({ ...baseRow, slug: `${product.slug}-copy-${Date.now().toString(36)}` })
      .select("id")
      .single();
  }
  if (inserted.error || !inserted.data) {
    return { ok: false, message: inserted.error?.message ?? "Could not duplicate." };
  }

  for (const variant of variants ?? []) {
    const {
      id: _vid,
      created_at: _vcreated,
      updated_at: _vupdated,
      deleted_at: _vdeleted,
      ...variantCopy
    } = variant;
    await supabase.from("product_variants").insert({ ...variantCopy, product_id: inserted.data.id });
  }

  revalidatePath("/admin/products");
  return { ok: true, newId: inserted.data.id };
}

export async function bulkSetProductsPublished(ids: string[], published: boolean): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;
  if (ids.length === 0) return { ok: false, message: "Select at least one product." };

  const supabase = await createClient();
  const { error } = await supabase.from("products").update({ is_published: published }).in("id", ids);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/admin/gift-cards");
  return { ok: true };
}

export async function bulkArchiveProducts(ids: string[]): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;
  if (ids.length === 0) return { ok: false, message: "Select at least one product." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), is_published: false })
    .in("id", ids);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/products");
  revalidatePath("/admin/gift-cards");
  return { ok: true };
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
