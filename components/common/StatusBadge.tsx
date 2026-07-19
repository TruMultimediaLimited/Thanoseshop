import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types/commerce";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-muted text-muted-foreground border-transparent",
  payment_review: "bg-accent/20 text-accent border-accent/40",
  paid: "bg-primary/15 text-primary border-primary/30",
  processing: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  refunded: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={cn(STATUS_STYLES[status])}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
