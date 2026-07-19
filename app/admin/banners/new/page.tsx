import type { Metadata } from "next";

import { BannerForm } from "@/components/admin/banners/BannerForm";
import { createBanner } from "@/lib/actions/admin/banners";

export const metadata: Metadata = { title: "New Banner | Admin" };

export default function NewBannerPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Banner</h1>
      <BannerForm action={createBanner} />
    </div>
  );
}
