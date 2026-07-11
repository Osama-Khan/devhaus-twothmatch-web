"use client";

import {
  Field,
  FieldError,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ConfigMultiSelect } from "@/features/jobs/components/config-multi-select";
import {
  BooleanSwitchField,
  NumberInputField,
} from "@/features/jobs/components/job-form-fields";
import { ConfigType } from "@/features/config/types/config-type";
import { getPermanentStep3FieldError } from "@/features/jobs/form/permanent-job-step-schemas";
import type { PermanentJobStepProps } from "@/features/jobs/types/permanent-job-form";

/** Step 3 — salary, benefits, and working hours */
export function PermanentSalaryBenefitsStep({
  data,
  onChange,
  showValidation = false,
}: PermanentJobStepProps) {
  const salaryError = showValidation
    ? getPermanentStep3FieldError(data, "salaryRange")
    : null;
  const startError = showValidation
    ? getPermanentStep3FieldError(data, "workingHoursStart")
    : null;
  const endError = showValidation
    ? getPermanentStep3FieldError(data, "workingHoursEnd")
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Salary & Benefits
        </h2>
        <p className="text-sm text-muted-foreground">
          Set pay, benefits, and typical working hours.
        </p>
      </div>

      <NumberInputField
        id="permanent-salary"
        label="Annual salary"
        value={data.salaryRange}
        required
        min={1001}
        step="1"
        placeholder="e.g. 65000"
        suffix="/yr"
        error={salaryError}
        onChange={(value) => onChange("salaryRange", value)}
      />

      <ConfigMultiSelect
        label="Benefits"
        configType={ConfigType.JOB_CREATION_BENEFITS}
        value={data.benefits}
        onValueChange={(value) => onChange("benefits", value)}
        required
        error={
          showValidation
            ? getPermanentStep3FieldError(data, "benefits")
            : null
        }
      />

      <div className="grid grid-cols-2 gap-3">
        <Field data-invalid={Boolean(startError) || undefined}>
          <RequiredFieldLabel htmlFor="permanent-hours-start">
            Working hours start
          </RequiredFieldLabel>
          <Input
            id="permanent-hours-start"
            type="time"
            value={data.workingHoursStart}
            aria-invalid={Boolean(startError) || undefined}
            onChange={(event) =>
              onChange("workingHoursStart", event.target.value)
            }
          />
          <FieldError>{startError}</FieldError>
        </Field>

        <Field data-invalid={Boolean(endError) || undefined}>
          <RequiredFieldLabel htmlFor="permanent-hours-end">
            Working hours end
          </RequiredFieldLabel>
          <Input
            id="permanent-hours-end"
            type="time"
            value={data.workingHoursEnd}
            aria-invalid={Boolean(endError) || undefined}
            onChange={(event) =>
              onChange("workingHoursEnd", event.target.value)
            }
          />
          <FieldError>{endError}</FieldError>
        </Field>
      </div>

      <BooleanSwitchField
        id="permanent-flexible"
        label="Flexible"
        description="Allow flexible working hours for this role."
        checked={data.isWorkingHoursFlexible}
        onCheckedChange={(checked) =>
          onChange("isWorkingHoursFlexible", checked)
        }
      />
    </div>
  );
}
