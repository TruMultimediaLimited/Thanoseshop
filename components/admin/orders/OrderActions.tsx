"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  markOrderCompleted,
  refundOrder,
  rejectPayment,
  startProcessing,
  verifyPayment,
} from "@/lib/actions/admin/orders";
import type { OrderStatus } from "@/lib/types/commerce";

export function OrderActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition();
  const [rejectReason, setRejectReason] = useState("");

  function run(action: () => Promise<{ ok: boolean; message?: string }>, successMsg: string) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.message ?? "Action failed");
        return;
      }
      toast.success(successMsg);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "payment_review" && (
        <>
          <Button
            disabled={isPending}
            onClick={() => run(() => verifyPayment(orderId), "Payment verified")}
          >
            Verify Payment
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isPending}>
                Reject Payment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject this payment?</AlertDialogTitle>
                <AlertDialogDescription>
                  The order will be cancelled. Give the customer a reason.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Amount doesn't match, transaction ID not found..."
              />
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => run(() => rejectPayment(orderId, rejectReason), "Payment rejected")}
                >
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {status === "paid" && (
        <Button disabled={isPending} onClick={() => run(() => startProcessing(orderId), "Order moved to processing")}>
          Start Processing
        </Button>
      )}

      {(status === "paid" || status === "processing") && (
        <Button disabled={isPending} onClick={() => run(() => markOrderCompleted(orderId), "Order marked completed")}>
          Mark Completed
        </Button>
      )}

      {(status === "paid" || status === "processing" || status === "completed") && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={isPending}>
              Refund
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Mark this order as refunded?</AlertDialogTitle>
              <AlertDialogDescription>
                This only updates the order status — process the actual refund through your
                payment method separately.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => run(() => refundOrder(orderId), "Order marked refunded")}>
                Confirm Refund
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
