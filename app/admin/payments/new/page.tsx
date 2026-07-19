import type { Metadata } from "next";

import { PaymentMethodForm } from "@/components/admin/payments/PaymentMethodForm";
import { createPaymentMethod } from "@/lib/actions/admin/payment-methods";

export const metadata: Metadata = { title: "New Payment Method | Admin" };

export default function NewPaymentMethodPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Payment Method</h1>
      <PaymentMethodForm action={createPaymentMethod} />
    </div>
  );
}
