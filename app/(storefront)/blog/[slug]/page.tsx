import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getBlogPostBySlug } from "@/lib/supabase/queries/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.meta_title ?? post.title,
    description: post.meta_description ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.meta_title ?? post.title,
      description: post.meta_description ?? post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      {post.cover_image_url && (
        <div className="bg-muted relative aspect-video overflow-hidden rounded-xl">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" priority />
        </div>
      )}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        {post.published_at && (
          <p className="text-muted-foreground mt-2 text-sm">
            {new Date(post.published_at).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="text-muted-foreground whitespace-pre-line text-sm leading-relaxed">
        {post.content}
      </div>
    </article>
  );
}
