"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { appRoutes } from "@/lib/routes";
import { isSuccessResponse } from "@/lib/types/response";
import { registerSchema, type RegisterFormData } from "@/features/auth/form";
import { authService } from "@/features/auth/services/auth-service";
import { PasswordField } from "@/features/auth/components/password-field";
import { PrivacyPolicyDialog } from "@/features/auth/components/privacy-policy-dialog";

/** Registration form — POST `/auth/signup`, then email verification */
export function RegisterForm() {
  const router = useRouter();
  const [pendingData, setPendingData] = useState<RegisterFormData | null>(null);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "practice",
    },
  });

  /** Validated form opens the privacy dialog; signup runs only after agreement. */
  function onValidatedSubmit(data: RegisterFormData) {
    setPendingData(data);
    setPolicyOpen(true);
  }

  function handlePolicyContinue() {
    if (!pendingData || isSigningUp) {
      return;
    }

    setIsSigningUp(true);
    setPolicyOpen(false);
    void completeSignup(pendingData);
  }

  async function completeSignup(data: RegisterFormData) {
    const response = await authService.signup(data);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      setPendingData(null);
      setIsSigningUp(false);
      return;
    }

    if (response.data.emailSendFailed) {
      toast.warning(
        "Account created, but we could not send the verification email."
      );
    } else {
      toast.success("Check your email for a verification code.");
    }

    setPendingData(null);
    setIsSigningUp(false);

    router.push(
      `${appRoutes.auth.verifyEmail._self.path}?email=${encodeURIComponent(response.data.email)}`
    );
  }

  return (
    <div className="rounded-3xl bg-card px-6 py-8 shadow-[0_8px_32px_rgba(39,38,67,0.08)] sm:px-8">
      <h1 className="text-center text-2xl font-semibold tracking-tight text-foreground">
        Sign Up
      </h1>

      <form
        onSubmit={handleSubmit(onValidatedSubmit)}
        className="mt-6 flex flex-col gap-5"
      >
        <Field data-invalid={Boolean(errors.email)}>
          <RequiredFieldLabel htmlFor="email">Email Address</RequiredFieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.fullName)}>
          <RequiredFieldLabel htmlFor="fullName">Full Name</RequiredFieldLabel>
          <Input
            id="fullName"
            autoComplete="name"
            placeholder="Enter"
            aria-invalid={Boolean(errors.fullName)}
            {...register("fullName")}
          />
          <FieldError>{errors.fullName?.message}</FieldError>
        </Field>

        <Field data-invalid={Boolean(errors.mobileNumber)}>
          <RequiredFieldLabel htmlFor="mobileNumber">
            Mobile Number
          </RequiredFieldLabel>
          <Input
            id="mobileNumber"
            type="tel"
            autoComplete="tel"
            placeholder="Enter"
            aria-invalid={Boolean(errors.mobileNumber)}
            {...register("mobileNumber")}
          />
          <FieldError>{errors.mobileNumber?.message}</FieldError>
        </Field>

        <PasswordField
          id="password"
          label={
            <>
              Create Password <span className="text-destructive">*</span>
            </>
          }
          autoComplete="new-password"
          error={errors.password?.message}
          registration={register("password")}
        />

        <PasswordField
          id="confirmPassword"
          label={
            <>
              Confirm Password <span className="text-destructive">*</span>
            </>
          }
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />

        <Button
          type="submit"
          disabled={isSubmitting || isSigningUp}
          className="w-full"
        >
          {isSigningUp ? "Signing up…" : "Sign Up"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={appRoutes.auth.login._self.path}
          className="font-semibold text-primary hover:underline"
        >
          Log In
        </Link>
      </p>

      <PrivacyPolicyDialog
        open={policyOpen}
        onOpenChange={(open) => {
          setPolicyOpen(open);
          if (!open && !isSigningUp) {
            setPendingData(null);
          }
        }}
        onContinue={handlePolicyContinue}
      />
    </div>
  );
}
