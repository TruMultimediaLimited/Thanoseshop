"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatPrice } from "@/components/catalog/ProductCard";
import { placeOrder } from "@/lib/actions/checkout";
import { toWebp } from "@/lib/image";
import { checkoutSchema, type CheckoutFormInput, type CheckoutInput } from "@/lib/validation/checkout";
import type { PaymentMethod } from "@/lib/types/commerce";

export function CheckoutForm({
  paymentMethods,
  total,
}: {
  paymentMethods: PaymentMethod[];
  total: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormInput, unknown, CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethodId: paymentMethods[0]?.id ?? "",
      amountClaimed: total,
    },
  });

  const selectedMethodId = watch("paymentMethodId");
  const selectedMethod = paymentMethods.find((m) => m.id === selectedMethodId);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setIsUploading(true);
    try {
      const file = await toWebp(rawFile);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/payment-screenshot", {
        method: "POST",
        body: formData,
      });
      const body = await res.json();

      if (!res.ok) {
        toast.error(body.error ?? "Upload failed");
        return;
      }

      setValue("screenshotPath", body.path, { shouldValidate: true });
      setScreenshotName(file.name);
    } finally {
      setIsUploading(false);
    }
  }

  function onSubmit(values: CheckoutInput) {
    startTransition(async () => {
      const result = await placeOrder(values);

      if (!result.ok) {
        if (result.requiresAuth) {
          router.push("/login?redirect=/checkout");
          return;
        }
        toast.error(result.message ?? "Could not place order");
        return;
      }

      toast.success("Order placed! We'll verify your payment shortly.");
      router.push(`/account/orders/${result.orderId}`);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div>
        <Label className="mb-3">Payment Method</Label>
        <RadioGroup
          value={selectedMethodId}
          onValueChange={(value) => setValue("paymentMethodId", value, { shouldValidate: true })}
        >
          {paymentMethods.map((method) => (
            <Label
              key={method.id}
              htmlFor={method.id}
              className="hover:border-primary/50 flex cursor-pointer items-center gap-3 rounded-lg border p-3"
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <span className="font-medium">{method.name}</span>
            </Label>
          ))}
        </RadioGroup>
        {errors.paymentMethodId && (
          <p className="text-destructive mt-1 text-xs">{errors.paymentMethodId.message}</p>
        )}
      </div>

      {selectedMethod && (
        <div className="bg-muted rounded-lg p-4 text-sm">
          {selectedMethod.account_number && (
            <p>
              Send payment to: <span className="font-semibold">{selectedMethod.account_number}</span>
            </p>
          )}
          {selectedMethod.account_name && <p>Account name: {selectedMethod.account_name}</p>}
          {selectedMethod.bank_name && <p>Bank: {selectedMethod.bank_name}</p>}
          {selectedMethod.instructions && (
            <p className="text-muted-foreground mt-1">{selectedMethod.instructions}</p>
          )}
          <p className="mt-2 font-medium">Amount to pay: {formatPrice(total)}</p>
        </div>
      )}

      <div>
        <Label htmlFor="transactionId" className="mb-2">
          Transaction ID
        </Label>
        <Input id="transactionId" {...register("transactionId")} placeholder="e.g. 8N7K2L9P" />
        {errors.transactionId && (
          <p className="text-destructive mt-1 text-xs">{errors.transactionId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="amountClaimed" className="mb-2">
          Amount Paid
        </Label>
        <Input
          id="amountClaimed"
          type="number"
          step="0.01"
          {...register("amountClaimed")}
        />
        {errors.amountClaimed && (
          <p className="text-destructive mt-1 text-xs">{errors.amountClaimed.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="screenshot" className="mb-2">
          Payment Screenshot
        </Label>
        <label
          htmlFor="screenshot"
          className="hover:border-primary/50 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center"
        >
          <Upload className="text-muted-foreground size-6" />
          <span className="text-muted-foreground text-sm">
            {isUploading ? "Uploading…" : screenshotName ?? "Click to upload a screenshot"}
          </span>
          <input
            id="screenshot"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {errors.screenshotPath && (
          <p className="text-destructive mt-1 text-xs">{errors.screenshotPath.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="couponCode" className="mb-2">
          Coupon Code (optional)
        </Label>
        <Input id="couponCode" {...register("couponCode")} placeholder="e.g. WELCOME10" />
      </div>

      <Button type="submit" size="lg" disabled={isPending || isUploading}>
        {isPending ? "Placing order…" : "Place Order"}
      </Button>
    </form>
  );
}
