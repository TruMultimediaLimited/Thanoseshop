import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Category } from "@/lib/types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <Card className="relative aspect-4/3 justify-end overflow-hidden p-0">
        {category.image_url && (
          <Image
            src={category.image_url}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <div className="from-background/90 relative bg-gradient-to-t to-transparent p-4">
          <p className="font-medium">{category.name}</p>
        </div>
      </Card>
    </Link>
  );
}
