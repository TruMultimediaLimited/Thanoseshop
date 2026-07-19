import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <div className="text-muted-foreground flex flex-col gap-5 text-sm leading-relaxed">
        <section>
          <h2 className="text-foreground mb-1 font-medium">Information We Collect</h2>
          <p>
            We collect the information you provide when creating an account (name, email, phone)
            and when placing an order (payment method, transaction ID, payment screenshot,
            in-game Player ID where applicable).
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">How We Use It</h2>
          <p>
            Your information is used to process and verify orders, deliver digital products,
            provide customer support, and improve our service. Payment screenshots are stored
            securely and only accessible to you and our admin team for verification purposes.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">Data Security</h2>
          <p>
            We use industry-standard practices to protect your data, including row-level access
            controls so your orders, cart, and payment proof are only ever visible to you and
            authorized staff.
          </p>
        </section>
        <section>
          <h2 className="text-foreground mb-1 font-medium">Your Rights</h2>
          <p>
            You can review and update your profile information at any time from your account
            dashboard. Contact us if you&apos;d like your account data removed.
          </p>
        </section>
      </div>
    </div>
  );
}
