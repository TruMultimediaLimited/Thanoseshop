import type { Metadata } from "next";

import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { createCategory } from "@/lib/actions/admin/categories";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "New Category | Admin" };

export default async function NewCategoryPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").is("deleted_at", null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Category</h1>
      <CategoryForm categories={(data ?? []) as Category[]} action={createCategory} />
    </div>
  );
}
