"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A plain CSS-toggle collapsible, not Radix's Accordion/Tabs — those
 * unmount their content when closed unless forceMount is passed (the exact
 * bug that broke ProductForm/GameForm's tabs before). Fields in here must
 * always stay in the DOM so FormData includes them regardless of whether
 * the section is visually open, so this just toggles a `hidden` class.
 */
export function AdvancedSection({
  title = "Advanced settings",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="hover:bg-secondary flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors"
      >
        {title}
        <ChevronDown className={cn("text-muted-foreground size-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <div className={cn("flex flex-col gap-4 border-t px-4 pt-4 pb-4", !open && "hidden")}>
        {children}
      </div>
    </div>
  );
}
