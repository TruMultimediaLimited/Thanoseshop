import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getGameBySlug, getProducts } from "@/lib/supabase/queries/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return {};
  return {
    title: game.meta_title ?? game.name,
    description: game.meta_description ?? game.description ?? undefined,
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const { products } = await getProducts({ gameSlug: slug, pageSize: 48 });

  // One product means there is nothing to choose here — take the customer
  // straight to the package/purchase page instead of an intermediate list.
  if (products.length === 1) {
    redirect(`/products/${products[0].slug}`);
  }

  return (
    <div className="flex flex-col">
      {game.banner_url && (
        <div className="bg-muted relative h-40 w-full overflow-hidden sm:h-56">
          <Image src={game.banner_url} alt={game.name} fill className="object-cover" priority />
        </div>
      )}

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {game.logo_url && (
            <div className="bg-muted relative size-16 shrink-0 overflow-hidden rounded-xl">
              <Image src={game.logo_url} alt={game.name} fill className="object-cover" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{game.name}</h1>
            {game.publisher && (
              <p className="text-muted-foreground text-sm">{game.publisher}</p>
            )}
          </div>
        </div>

        {game.description && (
          <p className="text-muted-foreground max-w-2xl text-sm">{game.description}</p>
        )}

        <ProductGrid
          products={products}
          emptyMessage="No top-ups published for this game yet."
        />
      </div>
    </div>
  );
}
