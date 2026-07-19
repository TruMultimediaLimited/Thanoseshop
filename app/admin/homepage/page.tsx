import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SectionRowActions } from "@/components/admin/homepage/SectionRowActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { createClient } from "@/lib/supabase/server";
import type { HomepageSection } from "@/lib/types/content";

export const metadata: Metadata = { title: "Homepage Manager | Admin" };

export default async function AdminHomepagePage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });

  const sections = (data ?? []) as HomepageSection[];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Homepage Manager" newHref="/admin/homepage/new" newLabel="Add Section" />
      <p className="text-muted-foreground -mt-4 text-sm">
        The homepage renders these sections top to bottom. Reorder, toggle, or remove them and
        the live site updates immediately — no code changes needed.
      </p>

      {sections.length === 0 ? (
        <EmptyState message="No homepage sections yet — the homepage will show a placeholder until you add one." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section, index) => (
              <TableRow key={section.id}>
                <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="font-medium capitalize">
                  {section.section_type.replace(/_/g, " ")}
                </TableCell>
                <TableCell className="text-muted-foreground">{section.title ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={section.is_active ? "default" : "secondary"}>
                    {section.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/homepage/${section.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <SectionRowActions id={section.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
