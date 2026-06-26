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
        return <>WIP</>;
    }
  };

  return (
    <div className="w-full max-w-lg">
      <OnboardingStepper
        currentStep={currentStep}
        totalSteps={ONBOARDING_TOTAL_STEPS}
      />
      <div className="mt-8 rounded-3xl bg-card p-6 shadow-lg">{renderStep()}</div>
    </div>
  );
}
