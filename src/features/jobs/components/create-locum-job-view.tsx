"use client";

import { useCallback, useState } from "react";
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
  buildCreateLocumJobRequest,
  createInitialLocumJobFormData,
  type LocumJobFormData,
} from "@/features/jobs/types/locum-job-form";
import { isLocumJobStepComplete } from "@/features/jobs/utils/is-locum-job-step-complete";
import { appRoutes } from "@/lib/routes";
import {
  isPaymentRequiredResponse,
  isSuccessResponse,
} from "@/lib/types/response";
import { cn } from "@/lib/utils";

type CreateLocumJobViewProps = {
  className?: string;
};

/** Multi-step locum job create wizard */
export function CreateLocumJobView({ className }: CreateLocumJobViewProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(createInitialLocumJobFormData);
  const [validatedSteps, setValidatedSteps] = useState<Set<number>>(
    () => new Set()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(
    <K extends keyof LocumJobFormData>(
      field: K,
      value: LocumJobFormData[K]
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
      buildCreateLocumJobRequest(formData)
    );

    if (isSuccessResponse(response)) {
      toast.success("Job posted successfully");
      router.push(appRoutes.nav.myJobs._self.path);
      return;
    }

    if (!isPaymentRequiredResponse(response)) {
      toast.error(response.error || "Failed to post job");
    }
    setIsSubmitting(false);
  };

  const goToNextStep = () => {
    if (!isLocumJobStepComplete(currentStep, formData)) {
      setValidatedSteps((previous) => new Set(previous).add(currentStep));
      return;
    }

    if (currentStep >= CREATE_LOCUM_JOB_TOTAL_STEPS) {
      void publishJob();
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
          {isLastStep ? (isSubmitting ? "Publishing…" : "Finish") : "Continue"}
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
