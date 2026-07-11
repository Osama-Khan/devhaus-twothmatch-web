"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import {
  Field,
  FieldError,
  FieldLabel,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import type { ConfigType } from "@/features/config/types/config-type";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "h-11 w-full min-w-0 appearance-none rounded-4xl border border-input bg-card px-3 py-1 pr-10 text-base transition-colors outline-none",
  "focus-visible:border-ring focus-visible:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "text-foreground md:text-sm"
);

type ConfigIdSelectProps = {
  id: string;
  label: string;
  configType: ConfigType;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  error?: string | null;
  placeholder?: string;
};

/** Native select populated from `GET /config/{type}` — label = name, value = id */
export function ConfigIdSelect({
  id,
  label,
  configType,
  value,
  onValueChange,
  required = false,
  error = null,
  placeholder = "Select",
}: ConfigIdSelectProps) {
  const { items, isLoading, error: loadError } = useConfigByType(configType);
  const LabelComponent = required ? RequiredFieldLabel : FieldLabel;

  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <LabelComponent htmlFor={id}>{label}</LabelComponent>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={isLoading}
          onChange={(event) => onValueChange(event.target.value)}
          className={selectClassName}
          aria-invalid={Boolean(error) || undefined}
        >
          <option value="" disabled>
            {isLoading ? "Loading…" : placeholder}
          </option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
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
