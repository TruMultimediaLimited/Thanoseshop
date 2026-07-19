import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HomepageSectionForm } from "@/components/admin/homepage/HomepageSectionForm";
import { updateHomepageSection } from "@/lib/actions/admin/homepage-sections";
import { createClient } from "@/lib/supabase/server";
import type { HomepageSection } from "@/lib/types/content";

export const metadata: Metadata = { title: "Edit Homepage Section | Admin" };

export default async function EditHomepageSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: section } = await supabase.from("homepage_sections").select("*").eq("id", id).maybeSingle();

  if (!section) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Homepage Section</h1>
      <HomepageSectionForm section={section as HomepageSection} action={updateHomepageSection.bind(null, id)} />
    </div>
  );
}
