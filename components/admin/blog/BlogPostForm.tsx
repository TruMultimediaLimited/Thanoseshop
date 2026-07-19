"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { BlogPost } from "@/lib/types/content";

const initialState = { ok: false, message: "" };

export function BlogPostForm({
  post,
  action,
}: {
  post?: BlogPost;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(post?.cover_image_url ?? null);
  const [status, setStatus] = useState(post?.status ?? "draft");

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-4">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex flex-col gap-4 pt-4">
          <div>
            <Label htmlFor="title" className="mb-2">
              Title
            </Label>
            <Input id="title" name="title" defaultValue={post?.title} required />
          </div>
          <div>
            <Label htmlFor="slug" className="mb-2">
              Slug
            </Label>
            <Input id="slug" name="slug" defaultValue={post?.slug} required />
          </div>
          <div>
            <Label htmlFor="excerpt" className="mb-2">
              Excerpt
            </Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} />
          </div>
          <div>
            <Label className="mb-2">Cover Image</Label>
            <input type="hidden" name="coverImageUrl" value={coverImageUrl ?? ""} />
            <ImageUploader value={coverImageUrl} onChange={setCoverImageUrl} folder="blog" />
          </div>
          <div>
            <Label htmlFor="content" className="mb-2">
              Content
            </Label>
            <Textarea id="content" name="content" rows={12} defaultValue={post?.content ?? ""} required />
          </div>
          <div>
            <Label className="mb-2">Status</Label>
            <input type="hidden" name="status" value={status} />
            <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="flex flex-col gap-4 pt-4">
          <div>
            <Label htmlFor="metaTitle" className="mb-2">
              Meta Title
            </Label>
            <Input id="metaTitle" name="metaTitle" defaultValue={post?.meta_title ?? ""} />
          </div>
          <div>
            <Label htmlFor="metaDescription" className="mb-2">
              Meta Description
            </Label>
            <Textarea id="metaDescription" name="metaDescription" defaultValue={post?.meta_description ?? ""} />
          </div>
        </TabsContent>
      </Tabs>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Post"}
      </Button>
    </form>
  );
}
