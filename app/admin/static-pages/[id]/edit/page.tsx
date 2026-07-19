import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { StaticPageForm } from "@/components/admin/static-pages/StaticPageForm";
import { updateStaticPage } from "@/lib/actions/admin/static-pages";
import { createClient } from "@/lib/supabase/server";
import type { StaticPage } from "@/lib/types/content";

export const metadata: Metadata = { title: "Edit Static Page | Admin" };

export default async function EditStaticPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("static_pages").select("*").eq("id", id).maybeSingle();

  if (!page) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Static Page</h1>
      <StaticPageForm page={page as StaticPage} action={updateStaticPage.bind(null, id)} />
    </div>
  );
}
