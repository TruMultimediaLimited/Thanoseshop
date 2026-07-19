"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/lib/actions/reviews";

export function ReviewForm({ productId, orderItemId }: { productId: string; orderItemId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    startTransition(async () => {
      const result = await submitReview({ productId, orderItemId, rating, comment });
      if (!result.ok) {
        toast.error(result.message ?? "Could not submit review");
        return;
      }
      toast.success(result.message);
      setSubmitted(true);
    });
  }

  if (submitted) {
    return <p className="text-muted-foreground text-sm">Thanks for your review — it&apos;s pending moderation.</p>;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <p className="text-sm font-medium">Leave a review</p>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} stars`}>
            <Star className={i < rating ? "fill-accent text-accent size-5" : "text-muted-foreground size-5"} />
          </button>
        ))}
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product (optional)"
        rows={3}
      />
      <Button size="sm" className="w-fit" disabled={isPending} onClick={handleSubmit}>
        {isPending ? "Submitting…" : "Submit Review"}
      </Button>
    </div>
  );
}
