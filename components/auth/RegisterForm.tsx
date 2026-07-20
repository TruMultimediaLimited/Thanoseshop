"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const [serverError, setServerError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    setIsSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    });
    setIsSubmitting(false);

    if (error) {
      setServerError(error.message);
      return;
    }

    if (data.session) {
      router.push(redirectTo);
      router.refresh();
    } else {
      setCheckEmail(true);
    }
  }

  if (checkEmail) {
    return (
      <div className="text-center">
        <p className="font-medium">Check your inbox</p>
        <p className="text-muted-foreground mt-1 text-sm">
          We&apos;ve sent a confirmation link to finish creating your account.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="fullName" className="mb-2">
          Full Name
        </Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && (
          <p className="text-destructive mt-1 text-xs">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-destructive mt-1 text-xs">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password" className="mb-2">
          Password
        </Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-destructive mt-1 text-xs">{errors.password.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="mb-2">
          Confirm Password
        </Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <p className="text-destructive mt-1 text-xs">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && <p className="text-destructive text-sm">{serverError}</p>}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Sign up"}
      </Button>

      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground font-medium hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
