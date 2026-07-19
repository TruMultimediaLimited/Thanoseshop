import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getCategoryBySlug, getProducts } from "@/lib/supabase/queries/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { products } = await getProducts({ categorySlug: slug, pageSize: 48 });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            {category.description}
          </p>
        )}
      </div>
      <ProductGrid products={products} emptyMessage="No products in this category yet." />
    </div>
  );
}
