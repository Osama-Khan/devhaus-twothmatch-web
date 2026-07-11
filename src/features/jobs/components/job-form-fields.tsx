"use client";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type BooleanSwitchFieldProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  description?: string;
};

/** Labeled switch row for boolean job form fields */
export function BooleanSwitchField({
  id,
  label,
  checked,
  onCheckedChange,
  description,
}: BooleanSwitchFieldProps) {
  return (
    <FieldLabel htmlFor={id}>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>{label}</FieldTitle>
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
        </FieldContent>
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={label}
        />
      </Field>
    </FieldLabel>
  );
}

type RateIntervalToggleProps = {
  value: string;
  onChange: (value: "day" | "hour") => void;
  error?: string | null;
  showValidation?: boolean;
};

/** Daily / Hourly badge toggle for locum rate interval */
export function RateIntervalToggle({
  value,
  onChange,
  error = null,
}: RateIntervalToggleProps) {
  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <RequiredFieldLabel>Rate type</RequiredFieldLabel>
      <div className="flex gap-2">
        {(
          [
            { id: "day", label: "Daily" },
            { id: "hour", label: "Hourly" },
          ] as const
        ).map((option) => {
          const selected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "h-9 flex-1 rounded-full border px-4 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <FieldError>{error}</FieldError>
    </Field>
  );
}

type NumberInputFieldProps = {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string | null;
  min?: number;
  max?: number;
  step?: string | number;
  placeholder?: string;
  suffix?: string;
};

/** Numeric text input wrapped in Field */
export function NumberInputField({
  id,
  label,
  value,
  onChange,
  required = false,
  error = null,
  min,
  max,
  step = "any",
  placeholder,
  suffix,
}: NumberInputFieldProps) {
  const LabelComponent = required ? RequiredFieldLabel : FieldLabel;

  return (
    <Field data-invalid={Boolean(error) || undefined}>
      <LabelComponent htmlFor={id}>{label}</LabelComponent>
      <div className="relative">
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          aria-invalid={Boolean(error) || undefined}
          onChange={(event) => onChange(event.target.value)}
          className={cn(suffix && "pr-14")}
        />
        {suffix ? (
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      <FieldError>{error}</FieldError>
    </Field>
  );
}
