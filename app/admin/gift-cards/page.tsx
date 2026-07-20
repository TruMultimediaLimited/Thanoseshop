import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProductsTable, type ProductRow } from "@/components/admin/products/ProductsTable";
import { EmptyState } from "@/components/common/EmptyState";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Gift Cards | Admin" };

export default async function AdminGiftCardsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .in("product_type", ["giftcard", "subscription"])
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const products: ProductRow[] = (data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    product_type: product.product_type,
    game_name: null,
    base_price: product.base_price,
    compare_at_price: product.compare_at_price,
    has_variants: product.has_variants,
    stock_quantity: product.stock_quantity,
    is_published: product.is_published,
  }));

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Gift Cards & Subscriptions"
        newHref="/admin/products/new"
        newLabel="New Gift Card"
      />

      {products.length === 0 ? (
        <EmptyState message="No gift cards or subscriptions yet." />
      ) : (
        <ProductsTable products={products} showGame={false} />
      )}
    </div>
  );
}
