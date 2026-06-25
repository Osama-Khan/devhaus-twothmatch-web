import type { Metadata } from "next";
import { OnboardingFlow } from "@/features/onboarding/components/onboarding-flow";

export const metadata: Metadata = {
  title: "Onboarding",
};

/** Multi-step profile onboarding */
export default function OnboardingPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center bg-background px-4 py-10 sm:px-8">
      <OnboardingFlow />
    </main>
  );
}
