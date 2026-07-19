import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/catalog/ProductDetailClient";
import { FaqSection } from "@/components/home/FaqSection";
import { getFaqs, getProductBySlug } from "@/lib/supabase/queries/catalog";
import { getSiteSettings } from "@/lib/supabase/queries/settings";
import { getWishlistedProductIds } from "@/lib/supabase/queries/wishlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const settings = await getSiteSettings();
  const title = product.meta_title ?? `${product.name} | ${settings?.site_name ?? "Thanos E-Shop"}`;
  const description = product.meta_description ?? product.short_description ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.thumbnail_url ? [product.thumbnail_url] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [faqs, wishlistedIds] = await Promise.all([
    getFaqs(product.id),
    getWishlistedProductIds(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetailClient product={product} isWishlisted={wishlistedIds.has(product.id)} />
      {faqs.length > 0 && <FaqSection faqs={faqs} title="Product FAQs" />}
    </div>
  );
}
