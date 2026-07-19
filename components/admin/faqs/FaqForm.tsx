"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Faq } from "@/lib/types/catalog";

const initialState = { ok: false, message: "" };

export function FaqForm({
  faq,
  products,
  action,
}: {
  faq?: Faq;
  products: { id: string; name: string }[];
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [productId, setProductId] = useState(faq?.product_id ?? "");
  const [isPublished, setIsPublished] = useState(faq?.is_published ?? true);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label htmlFor="question" className="mb-2">
          Question
        </Label>
        <Input id="question" name="question" defaultValue={faq?.question} required />
      </div>

      <div>
        <Label htmlFor="answer" className="mb-2">
          Answer
        </Label>
        <Textarea id="answer" name="answer" defaultValue={faq?.answer} rows={4} required />
      </div>

      <div>
        <Label className="mb-2">Product (optional — leave blank for a site-wide FAQ)</Label>
        <input type="hidden" name="productId" value={productId} />
        <Select value={productId || "none"} onValueChange={(v) => setProductId(v === "none" ? "" : v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Site-wide" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Site-wide</SelectItem>
            {products.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sortOrder" className="mb-2">
          Sort Order
        </Label>
        <Input id="sortOrder" name="sortOrder" type="number" defaultValue={faq?.sort_order ?? 0} />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />
        <Switch checked={isPublished} onCheckedChange={setIsPublished} id="isPublished" />
        <Label htmlFor="isPublished">Published</Label>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save FAQ"}
      </Button>
    </form>
  );
}
