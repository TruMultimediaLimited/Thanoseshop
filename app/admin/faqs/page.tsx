import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deleteFaq } from "@/lib/actions/admin/faqs";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "FAQs | Admin" };

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("*, product:products(name)")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  const faqs = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="FAQs" newHref="/admin/faqs/new" newLabel="New FAQ" />

      {faqs.length === 0 ? (
        <EmptyState message="No FAQs yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((faq) => (
              <TableRow key={faq.id}>
                <TableCell className="max-w-md truncate font-medium">{faq.question}</TableCell>
                <TableCell className="text-muted-foreground">
                  {faq.product?.name ?? "Site-wide"}
                </TableCell>
                <TableCell>
                  <Badge variant={faq.is_published ? "default" : "secondary"}>
                    {faq.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/faqs/${faq.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deleteFaq.bind(null, faq.id)} label="FAQ" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
