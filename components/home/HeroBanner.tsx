"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Banner } from "@/lib/types/content";

export function HeroBanner({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[index];

  return (
    <div className="relative aspect-21/9 w-full overflow-hidden rounded-2xl sm:aspect-[3/1]">
      {banners.map((b, i) => (
        <Link
          key={b.id}
          href={b.link_url ?? "#"}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            i === index ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image
            src={b.image_url}
            alt={b.title ?? ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
          {(b.title || b.subtitle) && (
            <div className="from-background/90 absolute inset-0 flex flex-col justify-end gap-1 bg-gradient-to-t via-transparent to-transparent p-6 sm:p-10">
              {b.title && (
                <h2 className="text-2xl font-semibold sm:text-4xl">{b.title}</h2>
              )}
              {b.subtitle && (
                <p className="text-muted-foreground max-w-md text-sm sm:text-base">
                  {b.subtitle}
                </p>
              )}
            </div>
          )}
        </Link>
      ))}

      {banners.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous banner"
            onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
            className="bg-background/60 hover:bg-background/80 absolute top-1/2 left-3 -translate-y-1/2 rounded-full p-1.5 backdrop-blur transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next banner"
            onClick={() => setIndex((i) => (i + 1) % banners.length)}
            className="bg-background/60 hover:bg-background/80 absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1.5 backdrop-blur transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((b, i) => (
              <button
                key={b.id}
                aria-label={`Go to banner ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "bg-primary w-5" : "bg-foreground/30 w-1.5",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
