import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { updateCategory } from "@/lib/actions/admin/categories";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "Edit Category | Admin" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: category }, { data: categories }] = await Promise.all([
    supabase.from("categories").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").is("deleted_at", null),
  ]);

  if (!category) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Category</h1>
      <CategoryForm
        category={category as Category}
        categories={(categories ?? []) as Category[]}
        action={updateCategory.bind(null, id)}
      />
    </div>
  );
}
