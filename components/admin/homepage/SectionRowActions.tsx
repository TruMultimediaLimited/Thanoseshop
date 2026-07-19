"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteHomepageSection, moveHomepageSection } from "@/lib/actions/admin/homepage-sections";

export function SectionRowActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function move(direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveHomepageSection(id, direction);
      if (!result.ok) toast.error(result.message ?? "Could not reorder");
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" disabled={isPending} onClick={() => move("up")}>
        <ChevronUp className="size-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled={isPending} onClick={() => move("down")}>
        <ChevronDown className="size-4" />
      </Button>
      <DeleteButton action={deleteHomepageSection.bind(null, id)} label="section" />
    </div>
  );
}
