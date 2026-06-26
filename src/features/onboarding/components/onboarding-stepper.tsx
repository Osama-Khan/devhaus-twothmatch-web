import { cn } from "@/lib/utils";

type OnboardingStepperProps = {
  /** Current step, 1-indexed */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  className?: string;
};

type StepSegmentState = "done" | "active" | "upcoming";

function getStepState(step: number, currentStep: number): StepSegmentState {
  if (step < currentStep) {
    return "done";
  }

  if (step === currentStep) {
    return "active";
  }

  return "upcoming";
}

/**
 * Onboarding progress header with step label and segmented progress bar.
 */
export function OnboardingStepper({
  currentStep,
  totalSteps,
  className,
}: OnboardingStepperProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Step {currentStep} of {totalSteps}
      </p>

      <div className="flex flex-row gap-2">
        {steps.map((step) => {
          const state = getStepState(step, currentStep);

          return (
            <div
              key={step}
              aria-hidden
              className={cn(
                "h-2.5 grow rounded-full",
                state === "done" && "bg-primary",
                state === "active" && "bg-primary",
                state === "upcoming" && "bg-muted"
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
