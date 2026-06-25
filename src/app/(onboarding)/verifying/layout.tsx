import { RequireVerifying } from "@/features/onboarding/utils/require-verifying";

/** Profile verification step — complete but unverified profiles only */
export default function VerifyingStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireVerifying>{children}</RequireVerifying>;
}
