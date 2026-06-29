"use client";

import { useCallback, useMemo, useState } from "react";
import { OnboardingStepper } from "@/features/onboarding/components/onboarding-stepper";
import { AboutYourBusinessStep } from "@/features/onboarding/components/steps/about-your-business-step";
import { ContactBrandInfoStep } from "@/features/onboarding/components/steps/contact-brand-info-step";
import { LocationBranchesStep } from "@/features/onboarding/components/steps/location-branches-step";
import { ProfilePreviewPublishStep } from "@/features/onboarding/components/steps/profile-preview-publish-step";
import { ONBOARDING_TOTAL_STEPS } from "@/features/onboarding/constants";
import {
  createInitialOnboardingFormData,
  type OnboardingFormData,
} from "@/features/onboarding/types/onboarding-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { isOnboardingStepComplete } from "@/features/onboarding/utils/is-onboarding-step-complete";

/** Four-step onboarding wizard with shared form state */
export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(createInitialOnboardingFormData);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(() => new Set());

  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(
      field: K,
      value: OnboardingFormData[K]
    ) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const goToNextStep = () => {
    if (!isOnboardingStepComplete(currentStep, formData)) {
      setValidatedSteps((previous) => new Set(previous).add(currentStep));
      return;
    }

    if (currentStep === ONBOARDING_TOTAL_STEPS) {
      toast.success("Profile saved.");
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, ONBOARDING_TOTAL_STEPS));
  };

  const canContinue = useMemo(
    () => isOnboardingStepComplete(currentStep, formData),
    [currentStep, formData]
  );

  const stepProps = {
    data: formData,
    onChange: updateField,
    showValidation: validatedSteps.has(currentStep),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AboutYourBusinessStep {...stepProps} />;
      case 2:
        return <ContactBrandInfoStep {...stepProps} />;
      case 3:
        return <LocationBranchesStep {...stepProps} />;
      case 4:
        return (
          <ProfilePreviewPublishStep
            data={formData}
            onAddPhotos={() => setCurrentStep(1)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col gap-8 grow">
      <OnboardingStepper
        currentStep={currentStep}
        totalSteps={ONBOARDING_TOTAL_STEPS}
      />
      <div className="rounded-3xl bg-card p-6 shadow-lg">{renderStep()}</div>
      <div className="flex flex-row gap-2">
        <Button size="icon" variant="outline" className={cn(currentStep === 1 && "hidden")} onClick={goToPreviousStep}>
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <Button className="grow" onClick={goToNextStep} disabled={!canContinue}>
          {currentStep === ONBOARDING_TOTAL_STEPS ? "Publish" : "Continue"}
          {currentStep !== ONBOARDING_TOTAL_STEPS && <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />}
        </Button>
      </div>
    </div>
  );
}
