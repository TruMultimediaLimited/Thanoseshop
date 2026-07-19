import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Terms & Conditions</h1>
      <div className="text-muted-foreground flex flex-col gap-5 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-1 font-medium">1. Orders & Payment</h2>
          <p>
            All orders are paid manually via the payment methods listed at checkout. After
            submitting your transaction ID and payment screenshot, your order enters payment
            review. Orders are only fulfilled once payment has been verified by our team.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">2. Accuracy of Information</h2>
          <p>
            You&apos;re responsible for providing accurate account/player information (such as
            Player ID or UID) at checkout. We are not responsible for top-ups delivered to an
            incorrect account due to information you provided.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">3. Delivery</h2>
          <p>
            Delivery times vary by product and are typically completed shortly after payment
            verification. You can track your order status from your account dashboard at any
            time.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">4. Prohibited Use</h2>
          <p>
            You may not use this platform for any unlawful purpose or to violate the terms of
            service of any third-party game or platform.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">5. Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after changes
            constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
