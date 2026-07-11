"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import {
  Field,
  FieldError,
  FieldLabel,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "h-11 w-full min-w-0 appearance-none rounded-4xl border border-input bg-card px-3 py-1 pr-10 text-base transition-colors outline-none",
  "focus-visible:border-ring focus-visible:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "text-foreground md:text-sm"
);

type LocationOption = {
  id: string;
  address: string;
};

type PracticeLocationSelectProps = {
  id: string;
  label: string;
  locations: LocationOption[];
  value: string;
  onValueChange: (value: string) => void;
  isLoading?: boolean;
  loadError?: string | null;
  required?: boolean;
  error?: string | null;
};

/** Native select of practice locations — label = address, value = id */
export function PracticeLocationSelect({
  id,
  label,
  locations,
  value,
  onValueChange,
  isLoading = false,
  loadError = null,
  required = false,
  error = null,
}: PracticeLocationSelectProps) {
  const LabelComponent = required ? RequiredFieldLabel : FieldLabel;

  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <LabelComponent htmlFor={id}>{label}</LabelComponent>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={isLoading || locations.length === 0}
          onChange={(event) => onValueChange(event.target.value)}
          className={selectClassName}
          aria-invalid={Boolean(error) || undefined}
        >
          <option value="" disabled>
            {isLoading
              ? "Loading…"
              : locations.length === 0
                ? "No locations available"
                : "Select"}
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.address}
            </option>
          ))}
        </select>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
      <FieldError>{loadError ?? error}</FieldError>
    </Field>
  );
}
