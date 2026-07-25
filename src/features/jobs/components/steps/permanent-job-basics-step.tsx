"use client";

import {
  Field,
  FieldError,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ConfigIdSelect } from "@/features/jobs/components/config-id-select";
import { PracticeLocationSelect } from "@/features/jobs/components/practice-location-select";
import { ConfigType } from "@/features/config/types/config-type";
import { getPermanentStep1FieldError } from "@/features/jobs/form/permanent-job-step-schemas";
import { usePracticeLocations } from "@/features/jobs/hooks/use-practice-locations";
import type { PermanentJobStepProps } from "@/features/jobs/types/permanent-job-form";
import { getMinFutureDateInputValue } from "@/features/jobs/utils/future-date";

/** Step 1 — role, location, contract, job type, and start date */
export function PermanentJobBasicsStep({
  data,
  onChange,
  showValidation = false,
}: PermanentJobStepProps) {
  const { locations, isLoading, error } = usePracticeLocations();

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Job Basics</h2>
        <p className="text-sm text-muted-foreground">
          Set the role, location, and contract details for this permanent job.
        </p>
      </div>

      <ConfigIdSelect
        id="permanent-role"
        label="Role"
        configType={ConfigType.JOB_TITLES}
        value={data.roleId}
        onValueChange={(value) => onChange("roleId", value)}
        required
        error={
          showValidation ? getPermanentStep1FieldError(data, "roleId") : null
        }
      />

      <PracticeLocationSelect
        id="permanent-location"
        label="Location"
        locations={locations}
        value={data.locationId}
        onValueChange={(value) => onChange("locationId", value)}
        isLoading={isLoading}
        loadError={error}
        required
        error={
          showValidation
            ? getPermanentStep1FieldError(data, "locationId")
            : null
        }
      />

      <ConfigIdSelect
        id="permanent-contract-type"
        label="Contract type"
        configType={ConfigType.CONTRACT_TYPES}
        value={data.contractTypeId}
        onValueChange={(value) => onChange("contractTypeId", value)}
        required
        error={
          showValidation
            ? getPermanentStep1FieldError(data, "contractTypeId")
            : null
        }
      />

      <ConfigIdSelect
        id="permanent-job-type"
        label="Job type"
        configType={ConfigType.JOB_CREATION_JOB_TYPES}
        value={data.jobTypeId}
        onValueChange={(value) => onChange("jobTypeId", value)}
        required
        error={
          showValidation
            ? getPermanentStep1FieldError(data, "jobTypeId")
            : null
        }
      />

      <Field
        data-invalid={
          (showValidation &&
            Boolean(getPermanentStep1FieldError(data, "startDate"))) ||
          undefined
        }
      >
        <RequiredFieldLabel htmlFor="permanent-start-date">
          Start date
        </RequiredFieldLabel>
        <Input
          id="permanent-start-date"
          type="date"
          min={getMinFutureDateInputValue()}
          value={data.startDate}
          aria-invalid={
            (showValidation &&
              Boolean(getPermanentStep1FieldError(data, "startDate"))) ||
            undefined
          }
          onChange={(event) => onChange("startDate", event.target.value)}
        />
        <FieldError>
          {showValidation
            ? getPermanentStep1FieldError(data, "startDate")
            : null}
        </FieldError>
      </Field>
    </div>
  );
}
