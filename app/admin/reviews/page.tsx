import type { Metadata } from "next";

import { ReviewActions } from "@/components/admin/reviews/ReviewActions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Reviews | Admin" };

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, product:products(name), customer:profiles(full_name)")
    .order("created_at", { ascending: false });

  const reviews = data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>

      {reviews.length === 0 ? (
        <EmptyState message="No reviews yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.product?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{review.customer?.full_name ?? "—"}</TableCell>
                <TableCell>{review.rating} / 5</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{review.comment ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      review.status === "approved"
                        ? "default"
                        : review.status === "rejected"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {review.status === "pending" && <ReviewActions id={review.id} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
