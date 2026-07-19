import { CategoryCard } from "@/components/catalog/CategoryCard";
import { SectionHeading } from "@/components/home/SectionHeading";
import { EmptyState } from "@/components/common/EmptyState";
import type { Category } from "@/lib/types/catalog";

export function FeaturedCategories({
  title,
  subtitle,
  categories,
}: {
  title?: string | null;
  subtitle?: string | null;
  categories: Category[];
}) {
  return (
    <section>
      <SectionHeading title={title} subtitle={subtitle} />
      {categories.length === 0 ? (
        <EmptyState message="No categories to show yet." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
