"use client";

import { ConfigIdSelect } from "@/features/jobs/components/config-id-select";
import { ConfigType } from "@/features/config/types/config-type";
import { getPermanentStep5FieldError } from "@/features/jobs/form/permanent-job-step-schemas";
import type { PermanentJobStepProps } from "@/features/jobs/types/permanent-job-form";

/** Step 5 — interview type */
export function PermanentInterviewStep({
  data,
  onChange,
  showValidation = false,
}: PermanentJobStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Interview & Application Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose how you want to interview candidates for this role.
        </p>
      </div>

      <ConfigIdSelect
        id="permanent-interview-type"
        label="Interview type"
        configType={ConfigType.INTERVIEW_TYPES}
        value={data.interviewTypeId}
        onValueChange={(value) => onChange("interviewTypeId", value)}
        required
        error={
          showValidation
            ? getPermanentStep5FieldError(data, "interviewTypeId")
            : null
        }
      />
    </div>
  );
}
