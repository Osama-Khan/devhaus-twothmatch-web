import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export const metadata: Metadata = {
  title: "Verify email",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-center text-sm">Loading…</p>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
