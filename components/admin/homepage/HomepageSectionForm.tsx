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
import { SECTION_TYPES } from "@/lib/validation/admin/homepage-section";
import type { HomepageSection } from "@/lib/types/content";

const initialState = { ok: false, message: "" };

const SECTION_LABELS: Record<string, string> = {
  hero_banner: "Hero Banner",
  search_bar: "Search Bar",
  popular_games: "Popular Games",
  trending_games: "Trending Games",
  featured_gift_cards: "Featured Gift Cards",
  featured_categories: "Featured Categories",
  best_sellers: "Best Sellers",
  latest_products: "Latest Products",
  flash_deals: "Flash Deals",
  why_choose_us: "Why Choose Us",
  testimonials: "Testimonials",
  faq: "FAQ",
  newsletter: "Newsletter",
};

export function HomepageSectionForm({
  section,
  action,
}: {
  section?: HomepageSection;
  action: (prevState: unknown, formData: FormData) => Promise<{ ok: boolean; message?: string }>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [sectionType, setSectionType] = useState(section?.section_type ?? "latest_products");
  const [isActive, setIsActive] = useState(section?.is_active ?? true);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div>
        <Label className="mb-2">Section Type</Label>
        <input type="hidden" name="sectionType" value={sectionType} />
        <Select value={sectionType} onValueChange={(v) => setSectionType(v as typeof sectionType)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SECTION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {SECTION_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="title" className="mb-2">
          Title (optional — falls back to a sensible default)
        </Label>
        <Input id="title" name="title" defaultValue={section?.title ?? ""} />
      </div>

      <div>
        <Label htmlFor="subtitle" className="mb-2">
          Subtitle
        </Label>
        <Input id="subtitle" name="subtitle" defaultValue={section?.subtitle ?? ""} />
      </div>

      <div>
        <Label htmlFor="configJson" className="mb-2">
          Config (JSON, optional)
        </Label>
        <Textarea
          id="configJson"
          name="configJson"
          rows={4}
          className="font-mono text-xs"
          defaultValue={section ? JSON.stringify(section.config, null, 2) : ""}
          placeholder={
            sectionType === "why_choose_us"
              ? '{"items": [{"icon": "zap", "title": "Fast", "description": "..."}]}'
              : sectionType === "testimonials"
                ? '{"items": [{"name": "Rahim", "quote": "...", "rating": 5}]}'
                : '{"limit": 8}'
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="hidden" name="isActive" value={isActive ? "on" : ""} />
        <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {state.message && <p className="text-destructive text-sm">{state.message}</p>}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Saving…" : "Save Section"}
      </Button>
    </form>
  );
}
