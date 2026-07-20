import type { ReactNode } from "react";
import { PackageSearch } from "lucide-react";

export function EmptyState({
  message,
  icon,
  action,
}: {
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-16 text-center">
      <div className="text-muted-foreground">
        {icon ?? <PackageSearch className="size-8" />}
      </div>
      <p className="text-muted-foreground text-sm">{message}</p>
      {action}
    </div>
  );
}
