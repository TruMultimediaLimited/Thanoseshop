import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { BlogPost } from "@/lib/types/content";

export async function getPublishedBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;
  return data as BlogPost | null;
}
