"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import type { ConfigType } from "@/features/config/types/config-type";

type ConfigMultiSelectProps = {
  label: string;
  configType: ConfigType;
  value: string[];
  onValueChange: (value: string[]) => void;
  required?: boolean;
  error?: string | null;
};

/** Checkbox group populated from config — stores selected item ids */
export function ConfigMultiSelect({
  label,
  configType,
  value,
  onValueChange,
  required = false,
  error = null,
}: ConfigMultiSelectProps) {
  const { items, isLoading, error: loadError } = useConfigByType(configType);
  const LabelComponent = required ? RequiredFieldLabel : FieldLabel;

  function toggleId(id: string, checked: boolean) {
    if (checked) {
      onValueChange(value.includes(id) ? value : [...value, id]);
      return;
    }

    onValueChange(value.filter((item) => item !== id));
  }

  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <LabelComponent>{label}</LabelComponent>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : loadError ? (
        <FieldError>{loadError}</FieldError>
      ) : items.length === 0 ? (
        <FieldError>No options available.</FieldError>
      ) : (
        <div
          role="group"
          aria-label={label}
          className="flex max-h-48 flex-col gap-3 overflow-y-auto rounded-2xl border border-border p-3"
        >
          {items.map((item) => {
            const checked = value.includes(item.id);

            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(next) =>
                    toggleId(item.id, Boolean(next))
                  }
                />
                {item.name}
              </label>
            );
          })}
        </div>
      )}
      <FieldError>{error}</FieldError>
    </Field>
  );
}
