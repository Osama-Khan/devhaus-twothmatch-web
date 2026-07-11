"use client";

import { BooleanSwitchField } from "@/features/jobs/components/job-form-fields";
import type { LocumJobStepProps } from "@/features/jobs/types/locum-job-form";

/** Step 4 — compliance filters for unverified candidates and docs */
export function LocumComplianceFiltersStep({
  data,
  onChange,
}: LocumJobStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Compliance Filters
        </h2>
        <p className="text-sm text-muted-foreground">
          Control who can book this shift based on verification and documents.
        </p>
      </div>

      <BooleanSwitchField
        id="locum-autoblock"
        label="Auto-block unverified candidates"
        description="Unverified candidates will not be able to apply or book."
        checked={data.autoblockUnverified}
        onCheckedChange={(checked) => onChange("autoblockUnverified", checked)}
      />

      <BooleanSwitchField
        id="locum-mandatory-docs"
        label="Mandatory docs for booking"
        description="Candidates must upload required documents before booking."
        checked={data.mandatoryDocsForBooking}
        onCheckedChange={(checked) =>
          onChange("mandatoryDocsForBooking", checked)
        }
      />
    </div>
  );
}
