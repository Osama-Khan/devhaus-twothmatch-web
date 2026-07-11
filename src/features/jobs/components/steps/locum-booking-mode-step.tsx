"use client";

import { FieldError } from "@/components/ui/field";
import { BooleanSwitchField } from "@/features/jobs/components/job-form-fields";
import { locumStep5Schema } from "@/features/jobs/form/locum-job-step-schemas";
import type { LocumJobStepProps } from "@/features/jobs/types/locum-job-form";

/** Step 5 — instant book vs approval-required booking mode */
export function LocumBookingModeStep({
  data,
  onChange,
  showValidation = false,
}: LocumJobStepProps) {
  const validationError = showValidation
    ? locumStep5Schema.safeParse({
        instantBook: data.instantBook,
        approvalRequired: data.approvalRequired,
      }).success
      ? null
      : "Choose Instant Book or Approval Required"
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Instant Book or Approval
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose how candidates confirm this shift. Pick one option.
        </p>
      </div>

      <BooleanSwitchField
        id="locum-instant-book"
        label="Instant Book"
        description="Qualified candidates can book immediately."
        checked={data.instantBook}
        onCheckedChange={(checked) => {
          onChange("instantBook", checked);
          if (checked) {
            onChange("approvalRequired", false);
          }
        }}
      />

      <BooleanSwitchField
        id="locum-approval-required"
        label="Approval Required"
        description="You review and approve each booking request."
        checked={data.approvalRequired}
        onCheckedChange={(checked) => {
          onChange("approvalRequired", checked);
          if (checked) {
            onChange("instantBook", false);
          }
        }}
      />

      <FieldError>{validationError}</FieldError>
    </div>
  );
}
