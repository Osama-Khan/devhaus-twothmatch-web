"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { PermanentComplianceStep } from "@/features/jobs/components/steps/permanent-compliance-step";
import { PermanentInterviewStep } from "@/features/jobs/components/steps/permanent-interview-step";
import { PermanentJobBasicsStep } from "@/features/jobs/components/steps/permanent-job-basics-step";
import { PermanentJobDetailsStep } from "@/features/jobs/components/steps/permanent-job-details-step";
import { PermanentPreviewPublishStep } from "@/features/jobs/components/steps/permanent-preview-publish-step";
import { PermanentSalaryBenefitsStep } from "@/features/jobs/components/steps/permanent-salary-benefits-step";
import { CREATE_PERMANENT_JOB_TOTAL_STEPS } from "@/features/jobs/constants";
import { jobsService } from "@/features/jobs/services/jobs-service";
import {
  buildCreatePermanentJobRequest,
  createInitialPermanentJobFormData,
  type PermanentJobFormData,
} from "@/features/jobs/types/permanent-job-form";
import { isPermanentJobStepComplete } from "@/features/jobs/utils/is-permanent-job-step-complete";
import { appRoutes } from "@/lib/routes";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";

type CreatePermanentJobViewProps = {
  className?: string;
};

/** Multi-step permanent job create wizard */
export function CreatePermanentJobView({
  className,
}: CreatePermanentJobViewProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(createInitialPermanentJobFormData);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(
    () => new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    <K extends keyof PermanentJobFormData>(
      field: K,
      value: PermanentJobFormData[K]
    ) => {
      setFormData((previous) => ({ ...previous, [field]: value }));
    },
    []
  );

  const goToPreviousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 1));
  };

  const publishJob = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const response = await jobsService.createJob(
      buildCreatePermanentJobRequest(formData)
    );

    if (isSuccessResponse(response)) {
      toast.success("Job posted successfully");
      router.push(appRoutes.nav.myJobs._self.path);
      return;
    }

    toast.error(response.error || "Failed to post job");
    setIsSubmitting(false);
  };

  const goToNextStep = () => {
    if (!isPermanentJobStepComplete(currentStep, formData)) {
      setValidatedSteps((previous) => new Set(previous).add(currentStep));
      return;
    }

    if (currentStep >= CREATE_PERMANENT_JOB_TOTAL_STEPS) {
      void publishJob();
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
        return <PermanentPreviewPublishStep {...stepProps} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === CREATE_PERMANENT_JOB_TOTAL_STEPS;

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
          disabled={isSubmitting}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
        </Button>
        <Button
          type="button"
          className="grow"
          onClick={goToNextStep}
          disabled={isSubmitting}
        >
          {isLastStep
            ? isSubmitting
              ? "Publishing…"
              : "Finish"
            : "Continue"}
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
