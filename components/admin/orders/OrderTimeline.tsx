"use client";

import { useActionState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { addOrderNote } from "@/lib/actions/admin/orders";
import { ORDER_STATUS_LABEL, type OrderEvent } from "@/lib/types/commerce";

const initialState = { ok: false, message: "" };

export function OrderTimeline({ orderId, events }: { orderId: string; events: OrderEvent[] }) {
  const [state, formAction, pending] = useActionState(
    addOrderNote.bind(null, orderId),
    initialState,
  );

  const sorted = [...events].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <Card className="gap-3 p-4 text-sm">
      <p className="font-medium">Timeline & Notes</p>

      <form action={formAction} className="flex flex-col gap-2">
        <Textarea name="note" rows={2} placeholder="Add an internal note (not visible to the customer)…" />
        {state.message && !state.ok && <p className="text-destructive text-xs">{state.message}</p>}
        <Button type="submit" variant="secondary" size="sm" disabled={pending} className="w-fit">
          {pending ? "Adding…" : "Add Note"}
        </Button>
      </form>

      {sorted.length === 0 ? (
        <p className="text-muted-foreground text-xs">No activity yet.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {sorted.map((event) => (
            <li key={event.id} className="border-border/60 flex gap-2 border-l-2 pl-3">
              <div className="flex flex-col gap-0.5">
                {event.event_type === "status_change" ? (
                  <p className="flex flex-wrap items-center gap-1.5">
                    {event.from_status ? (
                      <>
                        <span className="text-muted-foreground">
                          {ORDER_STATUS_LABEL[event.from_status]}
                        </span>
                        <ArrowRight className="text-muted-foreground size-3" />
                        <span className="font-medium">
                          {event.to_status ? ORDER_STATUS_LABEL[event.to_status] : "—"}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium">
                        Order placed
                        {event.to_status ? ` (${ORDER_STATUS_LABEL[event.to_status]})` : ""}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="flex items-start gap-1.5">
                    <MessageSquare className="text-primary mt-0.5 size-3.5 shrink-0" />
                    <span>{event.note}</span>
                  </p>
                )}
                <p className="text-muted-foreground text-xs">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
