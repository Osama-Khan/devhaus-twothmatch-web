import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type IconTextRowProps = {
  icon: IconSvgElement;
  label?: string;
  value: string;
  className?: string;
};

/** Compact icon + text row used in feed cards and shift details */
export function IconTextRow({ icon, label, value, className }: IconTextRowProps) {
  return (
    <div className={cn("flex min-w-0 items-start gap-2", className)}>
      <HugeiconsIcon
        icon={icon}
        strokeWidth={2}
        className="mt-0.5 size-4 shrink-0 text-primary"
      />
      <div className="min-w-0">
        {label ? (
          <p className="text-xs text-muted-foreground">{label}</p>
        ) : null}
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}
