import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm p-6">
        <h1 className="mb-2 text-center text-xl font-semibold">Forgot your password?</h1>
        <p className="text-muted-foreground mb-6 text-center text-sm">
          We&apos;ll email you a link to reset it.
        </p>
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
