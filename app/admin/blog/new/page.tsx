import type { Metadata } from "next";

import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { createBlogPost } from "@/lib/actions/admin/blog";

export const metadata: Metadata = { title: "New Blog Post | Admin" };

export default function NewBlogPostPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Blog Post</h1>
      <BlogPostForm action={createBlogPost} />
    </div>
  );
}
