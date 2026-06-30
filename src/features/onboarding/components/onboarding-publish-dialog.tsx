"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ONBOARDING_PUBLISH_STEPS,
  type OnboardingPublishStep,
} from "@/features/onboarding/types/onboarding-publish-step";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";

type OnboardingPublishDialogProps = {
  open: boolean;
  currentStep: OnboardingPublishStep;
};

function getStepStatus(
  stepId: OnboardingPublishStep,
  currentStep: OnboardingPublishStep
): "complete" | "active" | "pending" {
  const stepIndex = ONBOARDING_PUBLISH_STEPS.findIndex(
    (step) => step.id === stepId
  );
  const currentIndex = ONBOARDING_PUBLISH_STEPS.findIndex(
    (step) => step.id === currentStep
  );

  if (stepIndex < currentIndex) {
    return "complete";
  }

  if (stepIndex === currentIndex) {
    return "active";
  }

  return "pending";
}

/** Unclosable progress dialog shown while onboarding is being published */
export function OnboardingPublishDialog({
  open,
  currentStep,
}: OnboardingPublishDialogProps) {
  const activeStep = ONBOARDING_PUBLISH_STEPS.find(
    (step) => step.id === currentStep
  );
  if (!activeStep) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Publishing profile</DialogTitle>
          <DialogDescription>
            Please wait while your profile is uploaded and saved.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 items-center">
          <HugeiconsIcon
            icon={activeStep.icon}
            className="size-8 text-primary"
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              {activeStep.label}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
