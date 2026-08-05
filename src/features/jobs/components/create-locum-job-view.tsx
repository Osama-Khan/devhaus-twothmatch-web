"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { LocumBookingModeStep } from "@/features/jobs/components/steps/locum-booking-mode-step";
import { LocumComplianceFiltersStep } from "@/features/jobs/components/steps/locum-compliance-filters-step";
import { LocumPreviewPublishStep } from "@/features/jobs/components/steps/locum-preview-publish-step";
import { LocumRatePaymentStep } from "@/features/jobs/components/steps/locum-rate-payment-step";
import { LocumRoleRequirementsStep } from "@/features/jobs/components/steps/locum-role-requirements-step";
import { LocumShiftBasicsStep } from "@/features/jobs/components/steps/locum-shift-basics-step";
import { CREATE_LOCUM_JOB_TOTAL_STEPS } from "@/features/jobs/constants";
import { jobsService } from "@/features/jobs/services/jobs-service";
import {
  buildCreateLocumDraftRequest,
  buildLocumStepFields,
  buildPublishLocumJobRequest,
  createInitialLocumJobFormData,
  type LocumJobFormData,
} from "@/features/jobs/types/locum-job-form";
import { isLocumJobStepComplete } from "@/features/jobs/utils/is-locum-job-step-complete";
import { mapMissingFieldsToLocumStep } from "@/features/jobs/utils/map-missing-fields-to-job-step";
import {
  getFirstIncompleteLocumStep,
  mapLocumJobDetailToFormData,
} from "@/features/jobs/utils/map-job-to-form-data";
import { appRoutes } from "@/lib/routes";
import {
  getMissingFields,
  isPaymentRequiredResponse,
  isPublishRequirementsNotMet,
  isSuccessResponse,
} from "@/lib/types/response";
import { cn } from "@/lib/utils";

type CreateLocumJobViewProps = {
  className?: string;
  /** Resume an existing draft from My Jobs via GET `/jobs/:id` */
  draftId?: string;
};

/** Multi-step locum job create wizard with draft-first server saves */
export function CreateLocumJobView({
  className,
  draftId,
}: CreateLocumJobViewProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(createInitialLocumJobFormData);
  const [jobId, setJobId] = useState<string | null>(draftId ?? null);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(
    () => new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrating, setIsHydrating] = useState(Boolean(draftId));

  const updateField = useCallback(
    <K extends keyof LocumJobFormData>(
      field: K,
      value: LocumJobFormData[K]
    ) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  useEffect(() => {
    if (!draftId) {
      setIsHydrating(false);
      return;
    }

    const resumeDraftId = draftId;
    let cancelled = false;

    async function hydrateDraft() {
      setIsHydrating(true);

      const response = await jobsService.getJob(resumeDraftId, "locum");

      if (cancelled) {
        return;
      }

      if (!isSuccessResponse(response)) {
        toast.error(response.error || "Failed to load draft");
        setIsHydrating(false);
        return;
      }

      if (response.data.type !== "locum") {
        toast.error("Draft is not a locum job");
        setIsHydrating(false);
        return;
      }

      const mapped = mapLocumJobDetailToFormData(response.data.job);
      setFormData(mapped);
      setJobId(response.data.job.id);
      setCurrentStep(getFirstIncompleteLocumStep(mapped));
      setIsHydrating(false);
    }

    void hydrateDraft();

    return () => {
      cancelled = true;
    };
  }, [draftId]);

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const saveStep = async (step: number): Promise<boolean> => {
    setIsSaving(true);

    try {
      if (!jobId) {
        if (step !== 1) {
          toast.error("Create the draft from step 1 first");
          return false;
        }

        const response = await jobsService.createJob(
          buildCreateLocumDraftRequest(formData)
        );

        if (!isSuccessResponse(response)) {
          toast.error(response.error || "Failed to save draft");
          return false;
        }

        setJobId(response.data.job.id);
        return true;
      }

      const fields = buildLocumStepFields(step, formData);
      const response = await jobsService.updateJob({
        id: jobId,
        type: "locum",
        ...fields,
      });

      if (!isSuccessResponse(response)) {
        toast.error(response.error || "Failed to save progress");
        return false;
      }

      return true;
    } finally {
      setIsSaving(false);
    }
  };

  const publishJob = async () => {
    if (isSubmitting) {
      return;
    }

    if (!jobId) {
      toast.error("Save the draft before publishing");
      return;
    }

    setIsSubmitting(true);

    const response = await jobsService.updateJob(
      buildPublishLocumJobRequest(jobId, formData)
    );

    if (isSuccessResponse(response)) {
      toast.success("Job posted successfully");
      router.push(appRoutes.nav.myJobs._self.path);
      return;
    }

    if (isPublishRequirementsNotMet(response)) {
      const missing = getMissingFields(response);
      const targetStep = mapMissingFieldsToLocumStep(missing);
      setValidatedSteps((previous) => new Set(previous).add(targetStep));
      setCurrentStep(targetStep);
      toast.error(
        response.error ||
          "Required fields are missing. Please complete the highlighted step."
      );
      setIsSubmitting(false);
      return;
    }

    if (!isPaymentRequiredResponse(response)) {
      toast.error(response.error || "Failed to post job");
    }
    setIsSubmitting(false);
  };

  const goToNextStep = async () => {
    if (!isLocumJobStepComplete(currentStep, formData)) {
      setValidatedSteps((previous) => new Set(previous).add(currentStep));
      return;
    }

    if (currentStep >= CREATE_LOCUM_JOB_TOTAL_STEPS) {
      void publishJob();
      return;
    }

    const saved = await saveStep(currentStep);
    if (!saved) {
      return;
    }

    setCurrentStep((step) => Math.min(step + 1, CREATE_LOCUM_JOB_TOTAL_STEPS));
  };

  const stepProps = {
    data: formData,
    onChange: updateField,
    showValidation: validatedSteps.has(currentStep),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <LocumShiftBasicsStep {...stepProps} />;
      case 2:
        return <LocumRatePaymentStep {...stepProps} />;
      case 3:
        return <LocumRoleRequirementsStep {...stepProps} />;
      case 4:
        return <LocumComplianceFiltersStep {...stepProps} />;
      case 5:
        return <LocumBookingModeStep {...stepProps} />;
      case 6:
        return <LocumPreviewPublishStep {...stepProps} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === CREATE_LOCUM_JOB_TOTAL_STEPS;
  const isBusy = isSubmitting || isSaving || isHydrating;

  if (isHydrating) {
    return (
      <div className={cn("flex w-full max-w-xl flex-col gap-8", className)}>
        <div className="rounded-3xl bg-card p-6 shadow-lg">
          <p className="text-sm text-muted-foreground">Loading draft…</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full max-w-xl flex-col gap-8", className)}>
      <Stepper
        currentStep={currentStep}
        totalSteps={CREATE_LOCUM_JOB_TOTAL_STEPS}
      />
      <div className="rounded-3xl bg-card p-6 shadow-lg">{renderStep()}</div>
      <div className="flex flex-row gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className={cn(currentStep === 1 && "hidden")}
          onClick={goToPreviousStep}
          disabled={isBusy}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <Button
          type="button"
          className="grow"
          onClick={() => void goToNextStep()}
          disabled={isBusy}
        >
          {isLastStep
            ? isSubmitting
              ? "Publishing…"
              : "Finish"
            : isSaving
              ? "Saving…"
              : "Continue"}
          {!isSaving && !isSubmitting ? (
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          ) : null}
        </Button>
      </div>
    </div>
  );
}
