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
import { saveOnboardingStep } from "@/features/onboarding/services/save-onboarding-step";
import {
  createInitialOnboardingFormData,
  type OnboardingFormData,
} from "@/features/onboarding/types/onboarding-form";
import type { OnboardingPublishStep } from "@/features/onboarding/types/onboarding-publish-step";
import { mapMissingFieldsToOnboardingStep } from "@/features/onboarding/utils/map-missing-fields-to-step";
import {
  getFirstIncompleteOnboardingStep,
  mapProfileToOnboardingForm,
} from "@/features/onboarding/utils/map-profile-to-onboarding-form";
import { isOnboardingStepComplete } from "@/features/onboarding/utils/is-onboarding-step-complete";
import { isPracticeProfileResponse } from "@/features/profile/types/profile-get-response";
import { profileService } from "@/features/profile/services/profile-service";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { appRoutes } from "@/lib/routes";
import { useAppDispatch, useAppStore, useAuthSelector } from "@/lib/store/hooks";
import { isSuccessResponse } from "@/lib/types/response";

const DONE_STEP_CLOSE_DELAY_MS = 800;

/** Practice onboarding wizard with shared form state and per-step server saves */
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
  const [isHydrating, setIsHydrating] = useState(true);
  const [isSavingStep, setIsSavingStep] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStep, setPublishStep] =
    useState<OnboardingPublishStep>("clinic-images");
  const closeDialogTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const hasHydratedRef = useRef(false);

  const updateField = useCallback(
    <K extends keyof OnboardingFormData>(
      field: K,
      value: OnboardingFormData[K]
    ) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const applyFormPatch = useCallback((patch?: Partial<OnboardingFormData>) => {
    if (!patch || Object.keys(patch).length === 0) {
      return;
    }
    setFormData((previous) => ({ ...previous, ...patch }));
  }, []);

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

  useEffect(() => {
    if (hasHydratedRef.current) {
      return;
    }
    hasHydratedRef.current = true;

    let cancelled = false;

    async function hydrate() {
      setIsHydrating(true);
      const response = await profileService.getProfile();

      if (cancelled) {
        return;
      }

      if (!isSuccessResponse(response)) {
        toast.error(response.error || "Failed to load profile");
        setIsHydrating(false);
        return;
      }

      if (!isPracticeProfileResponse(response.data)) {
        setIsHydrating(false);
        return;
      }

      if (response.data.profile?.profileCompletion === true) {
        router.replace(appRoutes.onboarding.verifying._self.path);
        return;
      }

      const mapped = mapProfileToOnboardingForm(response.data);
      setFormData(mapped);
      setCurrentStep(getFirstIncompleteOnboardingStep(mapped));
      setIsHydrating(false);
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const startPublish = useCallback(async () => {
    if (!user) {
      toast.error("Session expired. Please sign in again.");
      return;
    }

    setIsPublishing(true);
    setPublishStep("saving");

    const result = await publishOnboarding(
      formData,
      setPublishStep,
      dispatch,
      () => store.getState().auth.user
    );

    applyFormPatch(result.formPatch);

    if (result.missingFields?.length) {
      const targetStep = mapMissingFieldsToOnboardingStep(result.missingFields);
      setValidatedSteps((previous) => new Set(previous).add(targetStep));
      setCurrentStep(targetStep);
      toast.error(
        result.error ||
          "Required fields are missing. Please complete the highlighted step."
      );
      closePublishDialog();
      return;
    }

    if (result.error) {
      toast.error(result.error);
      closePublishDialog();
      return;
    }

    closeDialogTimeoutRef.current = setTimeout(() => {
      closePublishDialog();
      router.replace(appRoutes.onboarding.verifying._self.path);
    }, DONE_STEP_CLOSE_DELAY_MS);
  }, [
    applyFormPatch,
    closePublishDialog,
    dispatch,
    formData,
    router,
    store,
    user,
  ]);

  useEffect(() => {
    return () => {
      clearCloseDialogTimeout();
    };
  }, [clearCloseDialogTimeout]);

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const goToNextStep = async () => {
    if (!isOnboardingStepComplete(currentStep, formData)) {
      setValidatedSteps((previous) => new Set(previous).add(currentStep));
      return;
    }

    if (currentStep === ONBOARDING_TOTAL_STEPS) {
      void startPublish();
      return;
    }

    // Steps 1–6: save partial section before advancing
    setIsSavingStep(true);
    const saveResult = await saveOnboardingStep(currentStep, formData);
    setIsSavingStep(false);

    if (saveResult.error) {
      toast.error(saveResult.error || "Failed to save progress");
      return;
    }

    applyFormPatch(saveResult.formPatch);
    setCurrentStep((step) => Math.min(step + 1, ONBOARDING_TOTAL_STEPS));
  };

  const canContinue = useMemo(
    () => isOnboardingStepComplete(currentStep, formData),
    [currentStep, formData]
  );

  const isBusy = isPublishing || isSavingStep || isHydrating;

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

  if (isHydrating) {
    return (
      <div className="w-full max-w-lg flex flex-col gap-8 grow">
        <div className="rounded-3xl bg-card p-6 shadow-lg">
          <p className="text-sm text-muted-foreground">Loading your profile…</p>
        </div>
      </div>
    );
  }

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
            disabled={isBusy}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
          <Button
            className="grow"
            onClick={() => void goToNextStep()}
            disabled={!canContinue || isBusy}
          >
            {currentStep === ONBOARDING_TOTAL_STEPS
              ? isPublishing
                ? "Publishing…"
                : "Publish"
              : isSavingStep
                ? "Saving…"
                : "Continue"}
            {currentStep !== ONBOARDING_TOTAL_STEPS && !isSavingStep && (
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
            )}
          </Button>
        </div>
      </div>

      <OnboardingPublishDialog open={isPublishing} currentStep={publishStep} />
    </>
  );
}
