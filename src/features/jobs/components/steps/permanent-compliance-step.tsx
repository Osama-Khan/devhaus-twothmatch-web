"use client";

import { ConfigMultiSelect } from "@/features/jobs/components/config-multi-select";
import { BooleanSwitchField } from "@/features/jobs/components/job-form-fields";
import { ConfigType } from "@/features/config/types/config-type";
import { getPermanentStep4FieldError } from "@/features/jobs/form/permanent-job-step-schemas";
import type { PermanentJobStepProps } from "@/features/jobs/types/permanent-job-form";

/** Step 4 — mandatory docs and auto-filter */
export function PermanentComplianceStep({
  data,
  onChange,
  showValidation = false,
}: PermanentJobStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Compliance Requirements
        </h2>
        <p className="text-sm text-muted-foreground">
          Choose required documents and how strictly they are enforced.
        </p>
      </div>

      <ConfigMultiSelect
        label="Mandatory docs for candidates"
        configType={ConfigType.COMPLIANCE_DOCUMENTS}
        value={data.complianceDocuments}
        onValueChange={(value) => onChange("complianceDocuments", value)}
        required
        error={
          showValidation
            ? getPermanentStep4FieldError(data, "complianceDocuments")
            : null
        }
      />

      <BooleanSwitchField
        id="permanent-auto-filter-docs"
        label="Auto-filter for only candidates with valid docs"
        description="Hide candidates who are missing the required documents."
        checked={data.autoFilterValidDocs}
        onCheckedChange={(checked) =>
          onChange("autoFilterValidDocs", checked)
        }
      />
    </div>
  );
}
