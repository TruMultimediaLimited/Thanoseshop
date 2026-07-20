import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BannerForm } from "@/components/admin/banners/BannerForm";
import { updateBanner } from "@/lib/actions/admin/banners";
import { createClient } from "@/lib/supabase/server";
import type { Banner } from "@/lib/types/content";

export const metadata: Metadata = { title: "Edit Banner | Admin" };

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: banner } = await supabase.from("banners").select("*").eq("id", id).maybeSingle();

  if (!banner) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Banner</h1>
      <BannerForm banner={banner as Banner} action={updateBanner.bind(null, id)} />
    </div>
  );
}
