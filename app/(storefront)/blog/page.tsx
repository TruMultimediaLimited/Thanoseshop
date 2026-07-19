import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { EmptyState } from "@/components/common/EmptyState";
import { getPublishedBlogPosts } from "@/lib/supabase/queries/blog";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>

      {posts.length === 0 ? (
        <EmptyState message="No posts published yet." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col gap-2">
              {post.cover_image_url && (
                <div className="bg-muted relative aspect-video overflow-hidden rounded-xl">
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <p className="font-medium group-hover:underline">{post.title}</p>
              {post.excerpt && <p className="text-muted-foreground line-clamp-2 text-sm">{post.excerpt}</p>}
              {post.published_at && (
                <p className="text-muted-foreground text-xs">
                  {new Date(post.published_at).toLocaleDateString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
