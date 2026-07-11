"use client";

import { Stepper } from "@/components/ui/stepper";
import { CREATE_JOB_TOTAL_STEPS } from "@/features/jobs/constants";
import { cn } from "@/lib/utils";

type CreateLocumJobViewProps = {
  className?: string;
};

/**
 * Locum job create wizard shell — stepper + form card.
 * Form step content will be added later.
 */
export function CreateLocumJobView({ className }: CreateLocumJobViewProps) {
  return (
    <div className={cn("flex w-full max-w-xl flex-col gap-8", className)}>
      <Stepper currentStep={1} totalSteps={CREATE_JOB_TOTAL_STEPS} />
      <div className="rounded-3xl bg-card p-6 shadow-lg">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground">
            Locum shift details
          </h2>
          <p className="text-sm text-muted-foreground">
            Form fields for this step will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
