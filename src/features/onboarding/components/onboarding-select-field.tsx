import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "h-11 w-full min-w-0 appearance-none rounded-4xl border border-input bg-card px-3 py-1 pr-10 text-base transition-colors outline-none",
  "focus-visible:border-ring focus-visible:bg-accent/40 focus-visible:ring-[3px] focus-visible:ring-ring/50",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "text-foreground md:text-sm"
);

type OnboardingSelectFieldProps = {
  id: string;
  label: string;
  options: readonly string[];
  value?: string;
  onValueChange?: (value: string) => void;
};

/** Styled native select used across onboarding steps */
export function OnboardingSelectField({
  id,
  label,
  options,
  value = "",
  onValueChange,
}: OnboardingSelectFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
          className={selectClassName}
        >
          <option value="" disabled>
            Select
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </Field>
  );
}
