import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PaymentMethodForm } from "@/components/admin/payments/PaymentMethodForm";
import { updatePaymentMethod } from "@/lib/actions/admin/payment-methods";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/types/commerce";

export const metadata: Metadata = { title: "Edit Payment Method | Admin" };

export default async function EditPaymentMethodPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: method } = await supabase.from("payment_methods").select("*").eq("id", id).maybeSingle();

  if (!method) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Payment Method</h1>
      <PaymentMethodForm method={method as PaymentMethod} action={updatePaymentMethod.bind(null, id)} />
    </div>
  );
}
