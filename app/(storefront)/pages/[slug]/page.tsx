import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getStaticPageBySlug } from "@/lib/supabase/queries/static-pages";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);
  if (!page) return {};

  return {
    title: page.meta_title ?? page.title,
    description: page.meta_description ?? undefined,
  };
}

export default async function StaticPagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getStaticPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
      <div className="text-muted-foreground mt-6 flex flex-col gap-4 text-sm leading-relaxed">
        {page.content
          .split(/\n{2,}/)
          .filter((paragraph) => paragraph.trim().length > 0)
          .map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
      </div>
    </div>
  );
}
