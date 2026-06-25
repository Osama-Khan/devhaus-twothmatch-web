import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type OnboardingSelectOptionProps = {
  label: string;
  selected: boolean;
  onSelect: () => void;
};

/** Single selectable row used in onboarding choice lists */
export function OnboardingSelectOption({
  label,
  selected,
  onSelect,
}: OnboardingSelectOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-border bg-card text-foreground hover:bg-muted/40"
      )}
    >
      <span>{label}</span>
      {selected ? (
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <HugeiconsIcon icon={Tick02Icon} className="size-3" strokeWidth={2} />
        </span>
      ) : null}
    </button>
  );
}
