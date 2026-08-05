"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { PermanentComplianceStep } from "@/features/jobs/components/steps/permanent-compliance-step";
import { PermanentInterviewStep } from "@/features/jobs/components/steps/permanent-interview-step";
import { PermanentJobBasicsStep } from "@/features/jobs/components/steps/permanent-job-basics-step";
import { PermanentJobDescriptionStep } from "@/features/jobs/components/steps/permanent-job-description-step";
import { PermanentJobDetailsStep } from "@/features/jobs/components/steps/permanent-job-details-step";
import { PermanentPreviewPublishStep } from "@/features/jobs/components/steps/permanent-preview-publish-step";
import { PermanentSalaryBenefitsStep } from "@/features/jobs/components/steps/permanent-salary-benefits-step";
import { CREATE_PERMANENT_JOB_TOTAL_STEPS } from "@/features/jobs/constants";
import { jobsService } from "@/features/jobs/services/jobs-service";
import {
  buildCreatePermanentDraftRequest,
  buildPermanentStepFields,
  buildPublishPermanentJobRequest,
  createInitialPermanentJobFormData,
  type PermanentJobFormData,
} from "@/features/jobs/types/permanent-job-form";
import { isPermanentJobStepComplete } from "@/features/jobs/utils/is-permanent-job-step-complete";
import { mapMissingFieldsToPermanentStep } from "@/features/jobs/utils/map-missing-fields-to-job-step";
import {
  getFirstIncompletePermanentStep,
  mapPermanentJobDetailToFormData,
} from "@/features/jobs/utils/map-job-to-form-data";
import { appRoutes } from "@/lib/routes";
import {
  getMissingFields,
  isPaymentRequiredResponse,
  isPublishRequirementsNotMet,
  isSuccessResponse,
} from "@/lib/types/response";
import { cn } from "@/lib/utils";

type CreatePermanentJobViewProps = {
  className?: string;
  /** Resume an existing draft from My Jobs via GET `/jobs/:id` */
  draftId?: string;
};

/** Multi-step permanent job create wizard with draft-first server saves */
export function CreatePermanentJobView({
  className,
  draftId,
}: CreatePermanentJobViewProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(createInitialPermanentJobFormData);
  const [jobId, setJobId] = useState<string | null>(draftId ?? null);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(
    () => new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrating, setIsHydrating] = useState(Boolean(draftId));

  const updateField = useCallback(
    <K extends keyof PermanentJobFormData>(
      field: K,
      value: PermanentJobFormData[K]
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

      const response = await jobsService.getJob(resumeDraftId, "permanent");

      if (cancelled) {
        return;
      }

      if (!isSuccessResponse(response)) {
        toast.error(response.error || "Failed to load draft");
        setIsHydrating(false);
        return;
      }

      if (response.data.type !== "permanent") {
        toast.error("Draft is not a permanent job");
        setIsHydrating(false);
        return;
      }

      const mapped = mapPermanentJobDetailToFormData(response.data.job);
      setFormData(mapped);
      setJobId(response.data.job.id);
      setCurrentStep(getFirstIncompletePermanentStep(mapped));
      setIsHydrating(false);
    }

    void hydrateDraft();

    return () => {
      cancelled = true;
    };
  }, [draftId]);

  const goToMyJobs = () => {
    router.push(appRoutes.nav.myJobs._self.path);
  };

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
          buildCreatePermanentDraftRequest(formData)
        );

        if (!isSuccessResponse(response)) {
          toast.error(response.error || "Failed to save draft");
          return false;
        }

        setJobId(response.data.job.id);
        return true;
      }

      const fields = buildPermanentStepFields(step, formData);
      const response = await jobsService.updateJob({
        id: jobId,
        type: "permanent",
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
      buildPublishPermanentJobRequest(jobId, formData)
    );

    if (isSuccessResponse(response)) {
      toast.success("Job posted successfully");
      goToMyJobs();
      return;
    }

    if (isPublishRequirementsNotMet(response)) {
      const missing = getMissingFields(response);
      const targetStep = mapMissingFieldsToPermanentStep(missing);
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
    if (!isPermanentJobStepComplete(currentStep, formData)) {
      setValidatedSteps((previous) => new Set(previous).add(currentStep));
      return;
    }

    if (currentStep >= CREATE_PERMANENT_JOB_TOTAL_STEPS) {
      void publishJob();
      return;
    }

    const saved = await saveStep(currentStep);
    if (!saved) {
      return;
    }

    setCurrentStep((step) =>
      Math.min(step + 1, CREATE_PERMANENT_JOB_TOTAL_STEPS)
    );
  };

  const stepProps = {
    data: formData,
    onChange: updateField,
    showValidation: validatedSteps.has(currentStep),
    jobId,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PermanentJobBasicsStep {...stepProps} />;
      case 2:
        return <PermanentJobDetailsStep {...stepProps} />;
      case 3:
        return <PermanentSalaryBenefitsStep {...stepProps} />;
      case 4:
        return <PermanentComplianceStep {...stepProps} />;
      case 5:
        return <PermanentInterviewStep {...stepProps} />;
      case 6:
        return <PermanentJobDescriptionStep {...stepProps} />;
      case 7:
        return <PermanentPreviewPublishStep {...stepProps} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === CREATE_PERMANENT_JOB_TOTAL_STEPS;
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
        totalSteps={CREATE_PERMANENT_JOB_TOTAL_STEPS}
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
