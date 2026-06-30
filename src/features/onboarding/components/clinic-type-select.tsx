"use client";

import { useEffect } from "react";
import { FieldError, RequiredFieldLabel } from "@/components/ui/field";
import { OnboardingSelectOption } from "@/features/onboarding/components/onboarding-select-option";
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import { ConfigType } from "@/features/config/types/config-type";

type ClinicTypeSelectProps = {
  value: string;
  onSelect: (selection: { id: string; name: string }) => void;
  showValidation?: boolean;
};

/** Loads clinic types from config and renders a required single-select list */
export function ClinicTypeSelect({
  value,
  onSelect,
  showValidation = false,
}: ClinicTypeSelectProps) {
  const { items, isLoading, isReady, error } = useConfigByType(
    ConfigType.TYPES_OF_CLINICS
  );

  useEffect(() => {
    if (!isReady || items.length === 0 || value.trim().length > 0) {
      return;
    }

    const firstOption = items[0];
    onSelect({ id: firstOption.id, name: firstOption.name });
  }, [isReady, items, value, onSelect]);

  const validationError =
    showValidation && !value.trim() ? "Clinic type is required" : null;

  return (
    <section className="flex flex-col gap-4">
      <RequiredFieldLabel>Type of Clinic</RequiredFieldLabel>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading clinic types…</p>
      ) : error ? (
        <FieldError>{error}</FieldError>
      ) : items.length === 0 ? (
        <FieldError>No clinic types are available right now.</FieldError>
      ) : (
        <div
          role="radiogroup"
          aria-label="Type of Clinic"
          className="flex flex-col gap-3 max-h-64 overflow-y-auto border-t border-b border-border"
        >
          <div className="h-8"></div>
          {items.map((option) => (
            <OnboardingSelectOption
              key={option.id}
              label={option.name}
              selected={value === option.id}
              onSelect={() => onSelect({ id: option.id, name: option.name })}
            />
          ))}
          <div className="h-8"></div>
        </div>
      )}
      <FieldError>{validationError}</FieldError>
    </section>
  );
}
