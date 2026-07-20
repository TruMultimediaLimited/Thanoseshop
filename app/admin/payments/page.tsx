import type { Metadata } from "next";
import Link from "next/link";
import { Pencil } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { deletePaymentMethod } from "@/lib/actions/admin/payment-methods";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/types/commerce";

export const metadata: Metadata = { title: "Payment Methods | Admin" };

export default async function AdminPaymentMethodsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("payment_methods").select("*").order("sort_order", { ascending: true });

  const methods = (data ?? []) as PaymentMethod[];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Payment Methods" newHref="/admin/payments/new" newLabel="New Method" />

      {methods.length === 0 ? (
        <EmptyState message="No payment methods yet. Customers won't be able to check out until you add one." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((method) => (
              <TableRow key={method.id}>
                <TableCell className="font-medium">{method.name}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{method.type}</TableCell>
                <TableCell className="text-muted-foreground">{method.account_number ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={method.is_active ? "default" : "secondary"}>
                    {method.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/payments/${method.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteButton action={deletePaymentMethod.bind(null, method.id)} label="payment method" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
