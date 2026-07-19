"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

const initialState = { ok: false, message: "" };

export function Newsletter({ title, subtitle }: { title?: string | null; subtitle?: string | null }) {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <div className="bg-card flex flex-col items-center gap-3 rounded-2xl border px-6 py-10 text-center">
      <Mail className="text-primary size-6" />
      <h2 className="text-xl font-semibold tracking-tight">
        {title ?? "Get notified about deals"}
      </h2>
      <p className="text-muted-foreground max-w-sm text-sm">
        {subtitle ?? "Subscribe for exclusive discounts on your favorite games and gift cards."}
      </p>
      <form action={formAction} className="mt-2 flex w-full max-w-md gap-2">
        <Input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="h-11"
        />
        <Button type="submit" size="lg" className="h-11" disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
        </Button>
      </form>
      {state.message && (
        <p className={state.ok ? "text-sm text-emerald-400" : "text-destructive text-sm"}>
          {state.message}
        </p>
      )}
    </div>
  );
}
