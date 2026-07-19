"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Boxed search trigger for the header. The expanding form is positioned
 * against the header's inner container (the nearest `relative` ancestor),
 * so it drops in as a full-width row just below the bar on every viewport.
 */
export function SearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={className}
      >
        {open ? <X className="size-4" /> : <Search className="size-4" />}
      </button>

      {open && (
        <form
          action="/products"
          className="border-border/60 bg-background absolute inset-x-0 top-full z-40 flex gap-2 border-b p-3"
        >
          <Input
            name="q"
            placeholder="Search games, gift cards..."
            autoFocus
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </form>
      )}
    </>
  );
}
