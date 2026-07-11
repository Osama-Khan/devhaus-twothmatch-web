"use client";

import {
  Field,
  FieldError,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ConfigMultiSelect } from "@/features/jobs/components/config-multi-select";
import { ConfigType } from "@/features/config/types/config-type";
import { getPermanentStep2FieldError } from "@/features/jobs/form/permanent-job-step-schemas";
import type { PermanentJobStepProps } from "@/features/jobs/types/permanent-job-form";

/** Step 2 — title, description, and role requirements */
export function PermanentJobDetailsStep({
  data,
  onChange,
  showValidation = false,
}: PermanentJobStepProps) {
  const titleError = showValidation
    ? getPermanentStep2FieldError(data, "jobTitle")
    : null;
  const descriptionError = showValidation
    ? getPermanentStep2FieldError(data, "jobDescription")
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Job Details</h2>
        <p className="text-sm text-muted-foreground">
          Describe the role and the skills candidates need.
        </p>
      </div>

      <Field data-invalid={Boolean(titleError) || undefined}>
        <RequiredFieldLabel htmlFor="permanent-job-title">
          Job title
        </RequiredFieldLabel>
        <Input
          id="permanent-job-title"
          value={data.jobTitle}
          placeholder="e.g. Associate Dentist"
          aria-invalid={Boolean(titleError) || undefined}
          onChange={(event) => onChange("jobTitle", event.target.value)}
        />
        <FieldError>{titleError}</FieldError>
      </Field>

      <Field data-invalid={Boolean(descriptionError) || undefined}>
        <RequiredFieldLabel htmlFor="permanent-job-description">
          Job description
        </RequiredFieldLabel>
        <Textarea
          id="permanent-job-description"
          rows={4}
          value={data.jobDescription}
          placeholder="Describe the role, responsibilities, and ideal candidate…"
          aria-invalid={Boolean(descriptionError) || undefined}
          onChange={(event) => onChange("jobDescription", event.target.value)}
        />
        <FieldError>{descriptionError}</FieldError>
      </Field>

      <ConfigMultiSelect
        label="Skills required"
        configType={ConfigType.SKILLS_REQUIRED}
        value={data.skills}
        onValueChange={(value) => onChange("skills", value)}
        required
        error={
          showValidation ? getPermanentStep2FieldError(data, "skills") : null
        }
      />

      <ConfigMultiSelect
        label="Software required"
        configType={ConfigType.SOFTWARE_REQUIRED}
        value={data.software}
        onValueChange={(value) => onChange("software", value)}
        required
        error={
          showValidation ? getPermanentStep2FieldError(data, "software") : null
        }
      />

      <ConfigMultiSelect
        label="Experience level"
        configType={ConfigType.EXPERIENCE_LEVELS}
        value={data.experienceLevels}
        onValueChange={(value) => onChange("experienceLevels", value)}
        required
        error={
          showValidation
            ? getPermanentStep2FieldError(data, "experienceLevels")
            : null
        }
      />

      <ConfigMultiSelect
        label="Specialisms"
        configType={ConfigType.SPECIALISMS}
        value={data.specialisms}
        onValueChange={(value) => onChange("specialisms", value)}
        required
        error={
          showValidation
            ? getPermanentStep2FieldError(data, "specialisms")
            : null
        }
      />
    </div>
  );
}
