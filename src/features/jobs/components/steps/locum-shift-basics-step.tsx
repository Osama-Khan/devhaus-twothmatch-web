"use client";

import { useEffect } from "react";
import {
  Field,
  FieldError,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ConfigIdSelect } from "@/features/jobs/components/config-id-select";
import { NumberInputField } from "@/features/jobs/components/job-form-fields";
import { PracticeLocationSelect } from "@/features/jobs/components/practice-location-select";
import { ConfigType } from "@/features/config/types/config-type";
import { getLocumStep1FieldError } from "@/features/jobs/form/locum-job-step-schemas";
import { usePracticeLocations } from "@/features/jobs/hooks/use-practice-locations";
import type { LocumJobStepProps } from "@/features/jobs/types/locum-job-form";
import { getMaxBreakDurationMins } from "@/features/jobs/utils/locum-shift-duration";

/** Step 1 — role, location, date, time window, and break */
export function LocumShiftBasicsStep({
  data,
  onChange,
  showValidation = false,
}: LocumJobStepProps) {
  const { locations, isLoading, error } = usePracticeLocations();
  const maxBreak = getMaxBreakDurationMins(data.timeStart, data.timeEnd);

  useEffect(() => {
    if (maxBreak == null) {
      return;
    }

    if (data.breakDurationMins > maxBreak) {
      onChange("breakDurationMins", maxBreak);
    }
  }, [data.breakDurationMins, maxBreak, onChange]);

  const roleError = showValidation
    ? getLocumStep1FieldError(data, "roleId")
    : null;
  const locationError = showValidation
    ? getLocumStep1FieldError(data, "locationId")
    : null;
  const dateError = showValidation
    ? getLocumStep1FieldError(data, "date")
    : null;
  const timeStartError = showValidation
    ? getLocumStep1FieldError(data, "timeStart")
    : null;
  const timeEndError = showValidation
    ? getLocumStep1FieldError(data, "timeEnd")
    : null;
  const breakError = showValidation
    ? getLocumStep1FieldError(data, "breakDurationMins")
    : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Shift Basics</h2>
        <p className="text-sm text-muted-foreground">
          Set the role, location, and schedule for this locum shift.
        </p>
      </div>

      <ConfigIdSelect
        id="locum-role"
        label="Role"
        configType={ConfigType.JOB_CREATION_ROLES}
        value={data.roleId}
        onValueChange={(value) => onChange("roleId", value)}
        required
        error={roleError}
      />

      <PracticeLocationSelect
        id="locum-location"
        label="Location"
        locations={locations}
        value={data.locationId}
        onValueChange={(value) => onChange("locationId", value)}
        isLoading={isLoading}
        loadError={error}
        required
        error={locationError}
      />

      <Field data-invalid={Boolean(dateError) || undefined}>
        <RequiredFieldLabel htmlFor="locum-date">Date</RequiredFieldLabel>
        <Input
          id="locum-date"
          type="date"
          value={data.date}
          aria-invalid={Boolean(dateError) || undefined}
          onChange={(event) => onChange("date", event.target.value)}
        />
        <FieldError>{dateError}</FieldError>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field data-invalid={Boolean(timeStartError) || undefined}>
          <RequiredFieldLabel htmlFor="locum-time-start">
            Start time
          </RequiredFieldLabel>
          <Input
            id="locum-time-start"
            type="time"
            value={data.timeStart}
            aria-invalid={Boolean(timeStartError) || undefined}
            onChange={(event) => onChange("timeStart", event.target.value)}
          />
          <FieldError>{timeStartError}</FieldError>
        </Field>

        <Field data-invalid={Boolean(timeEndError) || undefined}>
          <RequiredFieldLabel htmlFor="locum-time-end">
            End time
          </RequiredFieldLabel>
          <Input
            id="locum-time-end"
            type="time"
            value={data.timeEnd}
            aria-invalid={Boolean(timeEndError) || undefined}
            onChange={(event) => onChange("timeEnd", event.target.value)}
          />
          <FieldError>{timeEndError}</FieldError>
        </Field>
      </div>

      <NumberInputField
        id="locum-break"
        label="Break / lunch duration"
        value={data.breakDurationMins}
        min={0}
        max={maxBreak ?? undefined}
        step={5}
        suffix="mins"
        error={breakError}
        onChange={(value) => {
          const parsed = Number.parseInt(value, 10);
          onChange(
            "breakDurationMins",
            Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
          );
        }}
      />
      {maxBreak != null ? (
        <p className="-mt-3 text-xs text-muted-foreground">
          0 means no break. Maximum {maxBreak} minutes for this shift.
        </p>
      ) : (
        <p className="-mt-3 text-xs text-muted-foreground">
          Set start and end times to unlock the break limit (shift length − 20
          mins).
        </p>
      )}
    </div>
  );
}
