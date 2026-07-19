import type { Metadata } from "next";

import { Card } from "@/components/ui/card";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm p-6">
        <h1 className="mb-6 text-center text-xl font-semibold">Set a new password</h1>
        <ResetPasswordForm />
      </Card>
    </div>
  );
}
