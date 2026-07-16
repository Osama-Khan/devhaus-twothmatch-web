import { cn } from "@/lib/utils";

type InterviewListingCardSkeletonProps = {
  count?: number;
  className?: string;
};

/** Loading placeholders for the interviews list */
export function InterviewListingCardSkeleton({
  count = 3,
  className,
}: InterviewListingCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-3xl bg-card p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="size-12 shrink-0 rounded-full bg-muted" />
            <div className="min-w-0 flex-1 space-y-2 pt-1">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded-md bg-muted" />
                  <div className="h-3.5 w-28 rounded-md bg-muted" />
                </div>
                <div className="h-6 w-24 shrink-0 rounded-full bg-muted" />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
            <div className="h-7 w-16 rounded-full bg-muted" />
            <div className="h-7 w-20 rounded-full bg-muted" />
            <div className="h-7 w-18 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
