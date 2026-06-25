"use client";

import { useState } from "react";
import { OnboardingStepper } from "@/features/onboarding/components/onboarding-stepper";
import { AboutYourBusinessStep } from "@/features/onboarding/components/steps/about-your-business-step";
import { ONBOARDING_TOTAL_STEPS } from "@/features/onboarding/constants";

/** Seven-step onboarding wizard — step 1 implemented, others are placeholders */
export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, ONBOARDING_TOTAL_STEPS));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AboutYourBusinessStep onContinue={goToNextStep} />;
      default:
        return (
          <>WIP</>
        );
    }
  };

  return (
    <div className="w-full max-w-lg rounded-3xl bg-card px-6 py-8 shadow-[0_8px_32px_rgba(39,38,67,0.08)] sm:px-8">
      <OnboardingStepper
        currentStep={currentStep}
        totalSteps={ONBOARDING_TOTAL_STEPS}
      />
      <div className="mt-8">{renderStep()}</div>
    </div>
  );
}
