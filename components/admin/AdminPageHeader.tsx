import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AdminPageHeader({
  title,
  newHref,
  newLabel = "New",
}: {
  title: string;
  newHref?: string;
  newLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {newHref && (
        <Button asChild>
          <Link href={newHref}>
            <Plus />
            {newLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
