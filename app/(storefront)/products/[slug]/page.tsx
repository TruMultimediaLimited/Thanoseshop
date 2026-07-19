import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailClient } from "@/components/catalog/ProductDetailClient";
import { ReviewForm } from "@/components/catalog/ReviewForm";
import { ReviewsList } from "@/components/catalog/ReviewsList";
import { FaqSection } from "@/components/home/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { getFaqs, getProductBySlug } from "@/lib/supabase/queries/catalog";
import { getApprovedReviews, getReviewEligibility } from "@/lib/supabase/queries/reviews";
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

  const [faqs, wishlistedIds, reviews, eligibility] = await Promise.all([
    getFaqs(product.id),
    getWishlistedProductIds(),
    getApprovedReviews(product.id),
    getReviewEligibility(product.id),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thanoseshop.vercel.app";
  const price = product.has_variants
    ? Math.min(...product.variants.filter((v) => v.is_published).map((v) => v.price), Infinity)
    : product.base_price;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 sm:px-6 lg:px-8">
      {price != null && Number.isFinite(price) && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.short_description ?? product.description ?? undefined,
            image: product.thumbnail_url ?? undefined,
            url: `${baseUrl}/products/${product.slug}`,
            offers: {
              "@type": "Offer",
              url: `${baseUrl}/products/${product.slug}`,
              priceCurrency: "BDT",
              price,
              availability: "https://schema.org/InStock",
            },
          }}
        />
      )}
      <ProductDetailClient product={product} isWishlisted={wishlistedIds.has(product.id)} />
      {faqs.length > 0 && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }}
          />
          <FaqSection faqs={faqs} title="Product FAQs" />
        </>
      )}

      <section>
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Reviews</h2>
        <div className="flex flex-col gap-6">
          {eligibility.canReview && eligibility.orderItemId && (
            <ReviewForm productId={product.id} orderItemId={eligibility.orderItemId} />
          )}
          {eligibility.alreadyReviewed && (
            <p className="text-muted-foreground text-sm">You&apos;ve already reviewed this product.</p>
          )}
          <ReviewsList reviews={reviews} />
        </div>
      </section>
    </div>
  );
}
