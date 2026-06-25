"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { appEnv } from "@/lib/utils/env";
import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/lib/store/hooks";
import { setCredentials } from "@/lib/store/auth-slice";
import { isSuccessResponse } from "@/lib/types/response";
import { loginSchema, type LoginFormData } from "@/features/auth/form";
import { authService } from "@/features/auth/services/auth-service";
import { PasswordField } from "@/features/auth/components/password-field";
import { Checkbox } from "@/components/ui/checkbox";

const REMEMBER_EMAIL_KEY = "twothmatch.remembered-email";

function getRememberedEmailState() {
  if (typeof window === "undefined") {
    return { email: "", rememberMe: false };
  }

  const email = localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
  return { email, rememberMe: Boolean(email) };
}

/** Email/password login — POST `/auth/login` */
export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [{ email: rememberedEmail, rememberMe: initialRememberMe }] = useState(
    getRememberedEmailState
  );
  const [rememberMe, setRememberMe] = useState(initialRememberMe);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: rememberedEmail,
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const response = await authService.login(data);

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      return;
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    const session = authService.mapLoginResponse(response.data);
    authService.persistSession(session.user, session.token);
    dispatch(setCredentials(session));
    toast.success("Welcome back!");
    router.push(appRoutes.home._self.path);
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} sign-in is coming soon.`);
  };

  return (
    <div className="rounded-3xl bg-card px-6 py-8 shadow-[0_8px_32px_rgba(39,38,67,0.08)] sm:px-8">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Login
        </h1>
        <p className="text-sm text-muted-foreground">
          Please log in to get access to your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6 flex flex-col gap-5"
      >
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          registration={register("password")}
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
            />
            Remember me
          </label>

          <Link
            href={appRoutes.auth.forgotPassword._self.path}
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        By registering, I agree to the{" "}
        <Link
          href={appEnv.termsAndConditionsUrl}
          className="font-semibold text-foreground hover:underline"
        >
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link
          href={appEnv.privacyPolicyUrl}
          className="font-semibold text-foreground hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <div className="relative flex items-center">
          <Separator className="flex-1" />
          <span className="px-3 text-xs text-muted-foreground">
            Or continue with
          </span>
          <Separator className="flex-1" />
        </div>

        <div className="flex flex-row items-center justify-around gap-3">
          {[
            { id: "facebook", label: "Facebook", glyph: "f" },
            { id: "google", label: "Google", glyph: "G" },
            { id: "linkedin", label: "LinkedIn", glyph: "in" },
          ].map((provider) => (
            <Button
              key={provider.id}
              type="button"
              size="icon-lg"
              aria-label={`Continue with ${provider.label}`}
              onClick={() => handleSocialLogin(provider.label)}
              className={cn(
                "flex h-11 grow items-center justify-center rounded-4xl border border-border bg-muted/40 text-2xl font-bold text-muted-foreground transition-colors hover:bg-muted"
              )}
            >
              {provider.glyph}
            </Button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={appRoutes.auth.register._self.path}
          className="font-semibold text-primary hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
