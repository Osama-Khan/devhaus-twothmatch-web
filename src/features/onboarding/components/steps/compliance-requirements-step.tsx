"use client";

import { OnboardingSelectField } from "@/features/onboarding/components/onboarding-select-field";
import {
  DOCUMENTS_REQUIRED_OPTIONS,
  SKILLS_SOFTWARE_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
} from "@/features/onboarding/constants";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";

/** Step 4 — documents, experience, and skills requirements */
export function ComplianceRequirementsStep({
  data,
  onChange,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Compliance &amp; Requirements
      </h1>

      <div className="flex flex-col gap-5">
        <OnboardingSelectField
          id="documentsRequired"
          label="Documents Required"
          options={DOCUMENTS_REQUIRED_OPTIONS}
          value={data.documentsRequired}
          onValueChange={(value) => onChange("documentsRequired", value)}
        />
        <OnboardingSelectField
          id="yearsOfExperience"
          label="Years of Experience"
          options={YEARS_OF_EXPERIENCE_OPTIONS}
          value={data.yearsOfExperience}
          onValueChange={(value) => onChange("yearsOfExperience", value)}
        />
        <OnboardingSelectField
          id="skillsSoftwareRequired"
          label="Skills/Software Required"
          options={SKILLS_SOFTWARE_OPTIONS}
          value={data.skillsSoftwareRequired}
          onValueChange={(value) => onChange("skillsSoftwareRequired", value)}
        />
      </div>
    </div>
  );
}
