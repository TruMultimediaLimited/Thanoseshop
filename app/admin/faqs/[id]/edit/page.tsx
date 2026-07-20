import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqForm } from "@/components/admin/faqs/FaqForm";
import { updateFaq } from "@/lib/actions/admin/faqs";
import { createClient } from "@/lib/supabase/server";
import type { Faq } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "Edit FAQ | Admin" };

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: faq }, { data: products }] = await Promise.all([
    supabase.from("faqs").select("*").eq("id", id).maybeSingle(),
    supabase.from("products").select("id, name").is("deleted_at", null),
  ]);

  if (!faq) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit FAQ</h1>
      <FaqForm faq={faq as Faq} products={products ?? []} action={updateFaq.bind(null, id)} />
    </div>
  );
}
