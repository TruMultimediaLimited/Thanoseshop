import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { updateBlogPost } from "@/lib/actions/admin/blog";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types/content";

export const metadata: Metadata = { title: "Edit Blog Post | Admin" };

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();

  if (!post) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Blog Post</h1>
      <BlogPostForm post={post as BlogPost} action={updateBlogPost.bind(null, id)} />
    </div>
  );
}
