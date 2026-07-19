import type { Metadata } from "next";

import { ProductForm } from "@/components/admin/products/ProductForm";
import { createProduct } from "@/lib/actions/admin/products";
import { createClient } from "@/lib/supabase/server";
import type { Category, Game, Region } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "New Product | Admin" };

export default async function NewProductPage() {
  const supabase = await createClient();
  const [{ data: games }, { data: categories }, { data: regions }] = await Promise.all([
    supabase.from("games").select("*").is("deleted_at", null),
    supabase.from("categories").select("*").is("deleted_at", null),
    supabase.from("regions").select("*").is("deleted_at", null),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Product</h1>
      <ProductForm
        games={(games ?? []) as Game[]}
        categories={(categories ?? []) as Category[]}
        regions={(regions ?? []) as Region[]}
        action={createProduct}
      />
    </div>
  );
}
