"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { deliverOrderItem } from "@/lib/actions/admin/orders";

export function DeliverItemForm({
  orderItemId,
  orderId,
  existingPayload,
}: {
  orderItemId: string;
  orderId: string;
  existingPayload: string | null;
}) {
  const [payload, setPayload] = useState(existingPayload ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await deliverOrderItem(orderItemId, orderId, payload);
      if (!result.ok) {
        toast.error(result.message ?? "Could not save");
        return;
      }
      toast.success("Saved");
    });
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <Textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder="Paste the code / account credentials to deliver to the customer"
        rows={2}
      />
      <Button size="sm" className="w-fit" disabled={isPending} onClick={handleSave}>
        {isPending ? "Saving…" : "Save Delivery"}
      </Button>
    </div>
  );
}
