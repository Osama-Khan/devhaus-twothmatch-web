import { RequireOnboarding } from "@/features/onboarding/utils/require-onboarding";

/** Onboarding step — incomplete profile only */
export default function OnboardingStepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireOnboarding>{children}</RequireOnboarding>;
}
