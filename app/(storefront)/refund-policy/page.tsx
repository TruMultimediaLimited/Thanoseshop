import type { Metadata } from "next";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Refund Policy</h1>
      <div className="text-muted-foreground flex flex-col gap-5 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-1 font-medium">Digital Goods</h2>
          <p>
            Because our products are digital and delivered directly to your game account or as a
            code, all sales are final once an order has been marked completed and delivered.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">Payment Rejected</h2>
          <p>
            If we&apos;re unable to verify your payment, your order will be marked as cancelled
            and no product will be delivered. Contact support with your order number if you
            believe this was in error.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">Incorrect Information</h2>
          <p>
            We&apos;re unable to offer refunds for top-ups delivered to an incorrect Player
            ID/UID that you provided at checkout — please double check this information before
            submitting your order.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">Our Error</h2>
          <p>
            If a product was not delivered due to an error on our part after payment was
            verified, contact support with your order number and we&apos;ll make it right.
          </p>
        </section>
      </div>
    </div>
  );
}
