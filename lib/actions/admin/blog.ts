"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { requireAdminRole } from "@/lib/actions/admin/guard";
import { blogPostSchema } from "@/lib/validation/admin/blog";

interface ActionResult {
  ok: boolean;
  message?: string;
}

function parseForm(formData: FormData) {
  return blogPostSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImageUrl: formData.get("coverImageUrl"),
    status: formData.get("status"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
  });
}

function toRow(data: ReturnType<typeof blogPostSchema.parse>) {
  return {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt || null,
    content: data.content,
    cover_image_url: data.coverImageUrl || null,
    status: data.status,
    published_at: data.status === "published" ? new Date().toISOString() : null,
    meta_title: data.metaTitle || null,
    meta_description: data.metaDescription || null,
  };
}

export async function createBlogPost(_prevState: unknown, formData: FormData): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .insert({ ...toRow(parsed.data), author_id: gate.admin.userId });
  if (error) {
    return { ok: false, message: error.code === "23505" ? "That slug is already in use." : error.message };
  }

  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  _prevState: unknown,
  formData: FormData,
): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const parsed = parseForm(formData);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update(toRow(parsed.data))
    .eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/blog");
  revalidatePath(`/blog/${parsed.data.slug}`);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const gate = await requireAdminRole(["product_manager"]);
  if (!gate.ok) return gate;

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({ deleted_at: new Date().toISOString(), status: "draft" })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };
  revalidatePath("/admin/blog");
  return { ok: true };
}
