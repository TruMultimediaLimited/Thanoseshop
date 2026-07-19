import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RegionForm } from "@/components/admin/regions/RegionForm";
import { updateRegion } from "@/lib/actions/admin/regions";
import { createClient } from "@/lib/supabase/server";
import type { Region } from "@/lib/types/catalog";

export const metadata: Metadata = { title: "Edit Region | Admin" };

export default async function EditRegionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: region } = await supabase.from("regions").select("*").eq("id", id).maybeSingle();

  if (!region) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Region</h1>
      <RegionForm region={region as Region} action={updateRegion.bind(null, id)} />
    </div>
  );
}
