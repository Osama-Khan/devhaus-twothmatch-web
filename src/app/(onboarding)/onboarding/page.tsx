import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
};

/** Multi-step profile onboarding — content added in follow-up */
export default function OnboardingPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Complete your profile
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Onboarding steps will go here.
        </p>
      </div>
    </main>
  );
}
