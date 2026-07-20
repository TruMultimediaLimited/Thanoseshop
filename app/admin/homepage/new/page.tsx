import type { Metadata } from "next";

import { HomepageSectionForm } from "@/components/admin/homepage/HomepageSectionForm";
import { createHomepageSection } from "@/lib/actions/admin/homepage-sections";

export const metadata: Metadata = { title: "New Homepage Section | Admin" };

export default function NewHomepageSectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Add Homepage Section</h1>
      <HomepageSectionForm action={createHomepageSection} />
    </div>
  );
}
