import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export const metadata: Metadata = {
  title: "Verification Code",
};

export default function VerifyEmailPage() {
  return (
    <AuthSplitLayout>
      <Suspense
        fallback={
          <div className="rounded-3xl bg-card px-6 py-8 text-center text-sm text-muted-foreground">
            Loading…
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
