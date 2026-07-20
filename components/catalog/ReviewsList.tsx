import { Star } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Review } from "@/lib/types/content";

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-muted-foreground text-sm">No reviews yet — be the first to leave one.</p>;
  }

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{average.toFixed(1)}</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={i < Math.round(average) ? "fill-accent text-accent size-4" : "text-muted-foreground size-4"}
            />
          ))}
        </div>
        <span className="text-muted-foreground text-sm">
          ({reviews.length} review{reviews.length === 1 ? "" : "s"})
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="flex gap-3 border-t pt-4 first:border-t-0 first:pt-0">
            <Avatar className="size-8">
              <AvatarFallback>{(review.reviewer_name ?? "U").slice(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{review.reviewer_name}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={i < review.rating ? "fill-accent text-accent size-3" : "text-muted-foreground size-3"}
                    />
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-muted-foreground mt-1 text-sm">{review.comment}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
