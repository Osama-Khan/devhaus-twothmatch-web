"use client";

import { ConfigMultiSelect } from "@/features/jobs/components/config-multi-select";
import { ConfigType } from "@/features/config/types/config-type";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";

/** Step 4 — documents, skills, and software requirements */
export function ComplianceRequirementsStep({
  data,
  onChange,
  showValidation = false,
}: OnboardingStepProps) {
  const documentsError =
    showValidation && data.documentsRequiredIds.length === 0
      ? "Select at least one required document"
      : null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Compliance &amp; Requirements
      </h1>

      <div className="flex flex-col gap-5">
        <ConfigMultiSelect
          label="Documents Required"
          configType={ConfigType.DOCUMENTS_REQUIRED}
          value={data.documentsRequiredIds}
          onValueChange={(value) => onChange("documentsRequiredIds", value)}
          required
          error={documentsError}
        />
        <ConfigMultiSelect
          label="Skills Required"
          configType={ConfigType.SKILLS_REQUIRED}
          value={data.skillIds}
          onValueChange={(value) => onChange("skillIds", value)}
        />
        <ConfigMultiSelect
          label="Software Required"
          configType={ConfigType.SOFTWARE_REQUIRED}
          value={data.softwareIds}
          onValueChange={(value) => onChange("softwareIds", value)}
        />
      </div>
    </div>
  );
}
