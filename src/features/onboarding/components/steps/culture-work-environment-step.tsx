"use client";

import { useCallback } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ConfigIdSelect } from "@/features/jobs/components/config-id-select";
import { ConfigMultiSelect } from "@/features/jobs/components/config-multi-select";
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import { ConfigType } from "@/features/config/types/config-type";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";

/** Step 6 — optional culture, benefits, and workload preferences */
export function CultureWorkEnvironmentStep({
  data,
  onChange,
}: OnboardingStepProps) {
  const { items: workloadOptions } = useConfigByType(ConfigType.WORK_LOAD);

  const handleWorkloadChange = useCallback(
    (id: string) => {
      const selected = workloadOptions.find((item) => item.id === id);
      onChange("workloadStyleId", id);
      onChange("workloadStyleName", selected?.name ?? "");
    },
    [onChange, workloadOptions]
  );

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

        <ConfigMultiSelect
          label="Benefits Offered"
          configType={ConfigType.BENEFITS_OFFERED}
          value={data.benefitsOfferedIds}
          onValueChange={(value) => onChange("benefitsOfferedIds", value)}
        />

        <ConfigIdSelect
          id="workloadStyle"
          label="Workload style"
          configType={ConfigType.WORK_LOAD}
          value={data.workloadStyleId}
          onValueChange={handleWorkloadChange}
          placeholder="Select (optional)"
        />
      </div>
    </div>
  );
}
