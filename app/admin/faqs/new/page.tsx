import type { Metadata } from "next";

import { FaqForm } from "@/components/admin/faqs/FaqForm";
import { createFaq } from "@/lib/actions/admin/faqs";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "New FAQ | Admin" };

export default async function NewFaqPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("id, name").is("deleted_at", null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New FAQ</h1>
      <FaqForm products={data ?? []} action={createFaq} />
    </div>
  );
}
