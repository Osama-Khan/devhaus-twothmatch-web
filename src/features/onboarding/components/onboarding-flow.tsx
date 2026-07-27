"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Stepper } from "@/components/ui/stepper";
import { AboutYourBusinessStep } from "@/features/onboarding/components/steps/about-your-business-step";
import { ContactBrandInfoStep } from "@/features/onboarding/components/steps/contact-brand-info-step";
import { LocationBranchesStep } from "@/features/onboarding/components/steps/location-branches-step";
import { ComplianceRequirementsStep } from "@/features/onboarding/components/steps/compliance-requirements-step";
import { PaymentsInvoicingStep } from "@/features/onboarding/components/steps/payments-invoicing-step";
import { CultureWorkEnvironmentStep } from "@/features/onboarding/components/steps/culture-work-environment-step";
import { ProfilePreviewPublishStep } from "@/features/onboarding/components/steps/profile-preview-publish-step";
import { OnboardingPublishDialog } from "@/features/onboarding/components/onboarding-publish-dialog";
import { ONBOARDING_TOTAL_STEPS } from "@/features/onboarding/constants";
import { publishOnboarding } from "@/features/onboarding/services/publish-onboarding";
import {
  createInitialOnboardingFormData,
  type OnboardingFormData,
} from "@/features/onboarding/types/onboarding-form";
import type { OnboardingPublishStep } from "@/features/onboarding/types/onboarding-publish-step";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { appRoutes } from "@/lib/routes";
import { useAppDispatch, useAppStore, useAuthSelector } from "@/lib/store/hooks";
import { isOnboardingStepComplete } from "@/features/onboarding/utils/is-onboarding-step-complete";

const DONE_STEP_CLOSE_DELAY_MS = 800;

/** Practice onboarding wizard with shared form state */
export function OnboardingFlow() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const store = useAppStore();
  const { user } = useAuthSelector();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(createInitialOnboardingFormData);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(
    () => new Set()
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] =
    useState<OnboardingPublishStep>("clinic-images");
  const closeDialogTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(
      field: K,
      value: OnboardingFormData[K]
    ) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const clearCloseDialogTimeout = useCallback(() => {
    if (closeDialogTimeoutRef.current) {
      clearTimeout(closeDialogTimeoutRef.current);
      closeDialogTimeoutRef.current = null;
    }
  }, []);

  const closePublishDialog = useCallback(() => {
    clearCloseDialogTimeout();
    setIsPublishing(false);
    setPublishStep("clinic-images");
  }, [clearCloseDialogTimeout]);

  const startPublish = useCallback(async () => {
    if (!user) {
      toast.error("Session expired. Please sign in again.");
      return;
    }

    setIsPublishing(true);
    setPublishStep("clinic-images");

    const result = await publishOnboarding(
      formData,
      setPublishStep,
      dispatch,
      () => store.getState().auth.user
    );

    if (result.error) {
      toast.error(result.error);
      closePublishDialog();
      return;
    }

    closeDialogTimeoutRef.current = setTimeout(() => {
      closePublishDialog();
      router.replace(appRoutes.onboarding.verifying._self.path);
    }, DONE_STEP_CLOSE_DELAY_MS);
  }, [closePublishDialog, dispatch, formData, router, store, user]);

  useEffect(() => {
    return () => {
      clearCloseDialogTimeout();
    };
  }, [clearCloseDialogTimeout]);

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const goToNextStep = () => {
    if (!isOnboardingStepComplete(currentStep, formData)) {
      setValidatedSteps((previous) => new Set(previous).add(currentStep));
      return;
    }

    if (currentStep === ONBOARDING_TOTAL_STEPS) {
      void startPublish();
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
        return <ComplianceRequirementsStep {...stepProps} />;
      case 5:
        return <PaymentsInvoicingStep {...stepProps} />;
      case 6:
        return <CultureWorkEnvironmentStep {...stepProps} />;
      case 7:
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
    <>
      <div className="w-full max-w-lg flex flex-col gap-8 grow">
        <Stepper
          currentStep={currentStep}
          totalSteps={ONBOARDING_TOTAL_STEPS}
        />
        <div className="rounded-3xl bg-card p-6 shadow-lg">{renderStep()}</div>
        <div className="flex flex-row gap-2">
          <Button
            size="icon"
            variant="outline"
            className={cn(currentStep === 1 && "hidden")}
            onClick={goToPreviousStep}
            disabled={isPublishing}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button
            className="grow"
            onClick={goToNextStep}
            disabled={!canContinue || isPublishing}
          >
            {currentStep === ONBOARDING_TOTAL_STEPS ? "Publish" : "Continue"}
            {currentStep !== ONBOARDING_TOTAL_STEPS && (
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            )}
          </Button>
        </div>
      </div>

      <OnboardingPublishDialog open={isPublishing} currentStep={publishStep} />
    </>
  );
}
