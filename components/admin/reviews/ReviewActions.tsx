"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { approveReview, rejectReview } from "@/lib/actions/admin/reviews";

export function ReviewActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function run(action: (id: string) => Promise<{ ok: boolean; message?: string }>, msg: string) {
    startTransition(async () => {
      const result = await action(id);
      if (!result.ok) {
        toast.error(result.message ?? "Action failed");
        return;
      }
      toast.success(msg);
    });
  }

  return (
    <div className="flex gap-1">
      <Button size="icon" variant="ghost" disabled={isPending} onClick={() => run(approveReview, "Review approved")}>
        <Check className="size-4 text-emerald-500" />
      </Button>
      <Button size="icon" variant="ghost" disabled={isPending} onClick={() => run(rejectReview, "Review rejected")}>
        <X className="text-destructive size-4" />
      </Button>
    </div>
  );
}
