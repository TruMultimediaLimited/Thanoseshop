import { Star } from "lucide-react";

import { SectionHeading } from "@/components/home/SectionHeading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/common/EmptyState";

interface Testimonial {
  name: string;
  quote: string;
  rating?: number;
  avatar_url?: string;
}

export function Testimonials({
  title,
  subtitle,
  items,
}: {
  title?: string | null;
  subtitle?: string | null;
  items: Testimonial[];
}) {
  return (
    <section>
      <SectionHeading title={title ?? "Customer Reviews"} subtitle={subtitle} />
      {items.length === 0 ? (
        <EmptyState message="No customer reviews to show yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={i} className="bg-card flex flex-col gap-3 rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item.avatar_url} alt={item.name} />
                  <AvatarFallback>{item.name.slice(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Star
                          key={star}
                          className={
                            star < item.rating!
                              ? "fill-accent text-accent size-3.5"
                              : "text-muted-foreground size-3.5"
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-sm">&ldquo;{item.quote}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
