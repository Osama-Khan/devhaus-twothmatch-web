"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { appRoutes } from "@/lib/routes";
import { isSuccessResponse } from "@/lib/types/response";
import {
  verifyEmailSchema,
  type VerifyEmailFormData,
} from "@/features/auth/form";
import { authService } from "@/features/auth/services/auth-service";

/** OTP verification after signup — POST `/auth/verify-email` */
export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: emailFromQuery,
      code: "",
    },
  });

  const code = useWatch({ control, name: "code" }) ?? "";

  const onSubmit = async (data: VerifyEmailFormData) => {
    const response = await authService.verifyEmail(data);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message ?? "Email verified");
    router.push(appRoutes.auth.login._self.path);
  };

  const onFormSubmit = handleSubmit(onSubmit, (fieldErrors) => {
    if (fieldErrors.code) {
      setError("code", { message: fieldErrors.code.message });
    }
  });

  const onResend = async () => {
    if (!emailFromQuery) {
      toast.error("Missing email address. Please sign up again.");
      return;
    }

    setIsResending(true);

    const response = await authService.resendOtp(emailFromQuery);

    setIsResending(false);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    toast.success(response.data.message ?? "Verification code sent");
  };

  return (
    <div className="rounded-3xl bg-card px-6 py-8 shadow-[0_8px_32px_rgba(39,38,67,0.08)] sm:px-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Verification Code
        </h1>
        <p className="text-sm text-muted-foreground">
          Please enter the verification code you received
        </p>
      </div>

      <form onSubmit={onFormSubmit} className="mt-8 flex flex-col gap-6">
        <input type="hidden" {...register("email")} />
        <input type="hidden" {...register("code")} />

        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={code}
            onChange={(value) => {
              setValue("code", value, { shouldValidate: false });
              clearErrors("code");
            }}
            aria-invalid={Boolean(errors.code)}
          >
            <InputOTPGroup aria-invalid={Boolean(errors.code)}>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup aria-invalid={Boolean(errors.code)}>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {errors.code && (
            <p className="text-sm text-destructive">{errors.code.message}</p>
          )}

          <p className="text-center text-xs text-muted-foreground">
            Code is valid for 5 minutes or 3 attempts
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="secondary"
            disabled={isResending}
            onClick={() => void onResend()}
            className="h-10 rounded-4xl px-6 text-sm font-semibold"
          >
            {isResending ? "Sending…" : "Resend Code"}
          </Button>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="h-11 w-full rounded-4xl text-base"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
