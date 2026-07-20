import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/products/ProductForm";
import { updateProduct } from "@/lib/actions/admin/products";
import { createClient } from "@/lib/supabase/server";
import type { Category, Game, ProductWithRelations, Region } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "Edit Product | Admin" };

const PRODUCT_WITH_VARIANTS_SELECT = `*, variants:product_variants(*)`;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: games }, { data: categories }, { data: regions }] = await Promise.all([
    supabase.from("products").select(PRODUCT_WITH_VARIANTS_SELECT).eq("id", id).maybeSingle(),
    supabase.from("games").select("*").is("deleted_at", null),
    supabase.from("categories").select("*").is("deleted_at", null),
    supabase.from("regions").select("*").is("deleted_at", null),
  ]);

  if (!product) notFound();

  const typedProduct = product as unknown as ProductWithRelations;
  const publishedVariants = {
    ...typedProduct,
    variants: (typedProduct.variants ?? []).filter(
      (v) => !(v as unknown as { deleted_at: string | null }).deleted_at,
    ),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Product</h1>
      <ProductForm
        product={publishedVariants}
        games={(games ?? []) as Game[]}
        categories={(categories ?? []) as Category[]}
        regions={(regions ?? []) as Region[]}
        action={updateProduct.bind(null, id)}
      />
    </div>
  );
}
