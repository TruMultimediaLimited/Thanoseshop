import type { Metadata } from "next";

import { StaticPageForm } from "@/components/admin/static-pages/StaticPageForm";
import { createStaticPage } from "@/lib/actions/admin/static-pages";

export const metadata: Metadata = { title: "New Static Page | Admin" };

export default function NewStaticPagePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Static Page</h1>
      <StaticPageForm action={createStaticPage} />
    </div>
  );
}
