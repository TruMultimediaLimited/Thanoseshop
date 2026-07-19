import Link from "next/link";

import type { Category } from "@/lib/types/catalog";

export function CategoryPills({ categories }: { categories: Category[] }) {
  const topLevel = categories.filter((c) => !c.parent_id);
  if (topLevel.length === 0) return null;

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {topLevel.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="border-border text-foreground hover:border-primary hover:text-primary shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
