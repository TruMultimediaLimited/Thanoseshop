import type { Metadata } from "next";

import { ProductGrid } from "@/components/catalog/ProductGrid";
import { getFeaturedGiftCards } from "@/lib/supabase/queries/catalog";

export const metadata: Metadata = {
  title: "Gift Cards & Subscriptions",
  description: "Steam Wallet, Google Play, PSN, Xbox, Netflix, Spotify, and more — delivered fast.",
};

export default async function GiftCardsPage() {
  const products = await getFeaturedGiftCards(48);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Gift Cards & Subscriptions</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Steam Wallet, Google Play, PSN, Xbox, Netflix, Spotify, and more.
        </p>
      </div>
      <ProductGrid products={products} emptyMessage="No gift cards published yet." />
    </div>
  );
}
