import type { Metadata } from "next";

import { FaqSection } from "@/components/home/FaqSection";
import { getFaqs } from "@/lib/supabase/queries/catalog";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Frequently Asked Questions</h1>
      <FaqSection faqs={faqs} title={null} />
    </div>
  );
}
