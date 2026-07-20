import type { Metadata } from "next";

import { RegionForm } from "@/components/admin/regions/RegionForm";
import { createRegion } from "@/lib/actions/admin/regions";

export const metadata: Metadata = { title: "New Region | Admin" };

export default function NewRegionPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Region</h1>
      <RegionForm action={createRegion} />
    </div>
  );
}
