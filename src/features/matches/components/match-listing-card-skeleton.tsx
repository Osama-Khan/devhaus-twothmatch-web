import { cn } from "@/lib/utils";

type MatchListingCardSkeletonProps = {
  count?: number;
  className?: string;
};

/** Loading placeholders for the matches list */
export function MatchListingCardSkeleton({
  count = 3,
  className,
}: MatchListingCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-3xl border-l-4 border-l-muted bg-card p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="size-12 shrink-0 rounded-full bg-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <div className="h-4 w-44 rounded-md bg-muted" />
                  <div className="h-3.5 w-28 rounded-md bg-muted" />
                  <div className="h-5 w-32 rounded-full bg-muted" />
                </div>
                <div className="h-6 w-12 shrink-0 rounded-full bg-muted" />
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="h-3 w-20 rounded-md bg-muted" />
            <div className="mt-2.5 flex flex-wrap gap-2">
              <div className="h-7 w-24 rounded-full bg-muted" />
              <div className="h-7 w-20 rounded-full bg-muted" />
              <div className="h-7 w-28 rounded-full bg-muted" />
              <div className="h-7 w-36 rounded-full bg-muted" />
            </div>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="h-3 w-14 rounded-md bg-muted" />
            <div className="mt-2.5 flex flex-wrap gap-2">
              <div className="h-7 w-28 rounded-full bg-muted" />
              <div className="h-7 w-36 rounded-full bg-muted" />
              <div className="h-7 w-24 rounded-full bg-muted" />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="h-6 w-16 rounded-full bg-muted" />
            <div className="h-4 w-24 rounded-md bg-muted" />
          </div>
          <div className="mt-4 h-11 w-full rounded-4xl bg-muted" />
        </div>
      ))}
    </div>
  );
}
