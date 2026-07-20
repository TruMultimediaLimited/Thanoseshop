import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function buildHref(basePath: string, searchParams: Record<string, string | undefined>, page: number) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) =>
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1,
  );

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <Button variant="outline" size="icon" asChild>
        <Link
          href={buildHref(basePath, searchParams, currentPage - 1)}
          aria-disabled={currentPage <= 1}
          className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
        >
          <ChevronLeft />
        </Link>
      </Button>

      {pages.map((page, index) => {
        const prevPage = pages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="text-muted-foreground px-1 text-sm">…</span>}
            <Button
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              asChild
            >
              <Link href={buildHref(basePath, searchParams, page)}>{page}</Link>
            </Button>
          </span>
        );
      })}

      <Button variant="outline" size="icon" asChild>
        <Link
          href={buildHref(basePath, searchParams, currentPage + 1)}
          aria-disabled={currentPage >= totalPages}
          className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
        >
          <ChevronRight />
        </Link>
      </Button>
    </nav>
  );
}
