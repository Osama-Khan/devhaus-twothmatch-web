import { cn } from "@/lib/utils";

type MatchBadgeProps = {
  percent: number;
  className?: string;
};

/** Green match percentage pill on feed cards */
export function MatchBadge({ percent, className }: MatchBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full bg-[color-mix(in_srgb,var(--chart-3)_80%,white)] px-3 py-1 text-xs font-bold tracking-wide text-[var(--chart-2)] uppercase",
        className
      )}
    >
      {percent}% Match
    </span>
  );
}
