"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { OnboardingSelectField } from "@/features/onboarding/components/onboarding-select-field";
import {
  BENEFITS_OFFERED_OPTIONS,
  WORKLOAD_STYLE_OPTIONS,
} from "@/features/onboarding/constants";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";

/** Step 6 — optional culture, benefits, and workload preferences */
export function CultureWorkEnvironmentStep({
  data,
  onChange,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Culture &amp; Work Environment
        </h1>
        <p className="text-sm text-muted-foreground">Optional</p>
      </div>

      <div className="flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="clinicCultureDescriptors">
            Clinic Culture Descriptors
          </FieldLabel>
          <Input
            id="clinicCultureDescriptors"
            type="text"
            placeholder="Enter"
            value={data.clinicCultureDescriptors}
            onChange={(event) =>
              onChange("clinicCultureDescriptors", event.target.value)
            }
          />
        </Field>

        <OnboardingSelectField
          id="benefitsOffered"
          label="Benefits Offered"
          options={BENEFITS_OFFERED_OPTIONS}
          value={data.benefitsOffered}
          onValueChange={(value) => onChange("benefitsOffered", value)}
        />

        <OnboardingSelectField
          id="workloadStyle"
          label="Workload style"
          options={WORKLOAD_STYLE_OPTIONS}
          value={data.workloadStyle}
          onValueChange={(value) => onChange("workloadStyle", value)}
        />
      </div>
    </div>
  );
}
