"use client";

import { FieldError } from "@/components/ui/field";
import { ConfigMultiSelect } from "@/features/jobs/components/config-multi-select";
import { BooleanSwitchField } from "@/features/jobs/components/job-form-fields";
import { ConfigType } from "@/features/config/types/config-type";
import { locumStep3Schema } from "@/features/jobs/form/locum-job-step-schemas";
import type { LocumJobStepProps } from "@/features/jobs/types/locum-job-form";

function getArrayError(
  data: LocumJobStepProps["data"],
  field: "skills" | "software" | "specialisms"
): string | null {
  const result = locumStep3Schema.safeParse({
    skills: data.skills,
    software: data.software,
    specialisms: data.specialisms,
    ppeProvided: data.ppeProvided,
    isParkingAvailable: data.isParkingAvailable,
    isPublicTransportAvailable: data.isPublicTransportAvailable,
  });

  if (result.success) {
    return null;
  }

  const issue = result.error.issues.find((item) => item.path[0] === field);
  return issue?.message ?? null;
}

/** Step 3 — skills, software, specialisms, and site amenities */
export function LocumRoleRequirementsStep({
  data,
  onChange,
  showValidation = false,
}: LocumJobStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Role Requirements
        </h2>
        <p className="text-sm text-muted-foreground">
          Tell candidates what skills and site amenities to expect.
        </p>
      </div>

      <ConfigMultiSelect
        label="Skills"
        configType={ConfigType.SKILLS_REQUIRED}
        value={data.skills}
        onValueChange={(value) => onChange("skills", value)}
        required
        error={showValidation ? getArrayError(data, "skills") : null}
      />

      <ConfigMultiSelect
        label="Software"
        configType={ConfigType.SOFTWARE_REQUIRED}
        value={data.software}
        onValueChange={(value) => onChange("software", value)}
        required
        error={showValidation ? getArrayError(data, "software") : null}
      />

      <ConfigMultiSelect
        label="Specialisms"
        configType={ConfigType.SPECIALISMS}
        value={data.specialisms}
        onValueChange={(value) => onChange("specialisms", value)}
        required
        error={showValidation ? getArrayError(data, "specialisms") : null}
      />

      <BooleanSwitchField
        id="locum-ppe"
        label="PPE provided"
        checked={data.ppeProvided}
        onCheckedChange={(checked) => onChange("ppeProvided", checked)}
      />

      <BooleanSwitchField
        id="locum-parking"
        label="Parking available"
        checked={data.isParkingAvailable}
        onCheckedChange={(checked) => onChange("isParkingAvailable", checked)}
      />

      <BooleanSwitchField
        id="locum-transport"
        label="Public transport available"
        checked={data.isPublicTransportAvailable}
        onCheckedChange={(checked) =>
          onChange("isPublicTransportAvailable", checked)
        }
      />

      {showValidation &&
      !locumStep3Schema.safeParse({
        skills: data.skills,
        software: data.software,
        specialisms: data.specialisms,
        ppeProvided: data.ppeProvided,
        isParkingAvailable: data.isParkingAvailable,
        isPublicTransportAvailable: data.isPublicTransportAvailable,
      }).success ? (
        <FieldError className="sr-only">
          Complete required role requirements
        </FieldError>
      ) : null}
    </div>
  );
}
