import { cn } from "@/lib/utils";

type JobListingCardSkeletonProps = {
  count?: number;
  className?: string;
};

/** Loading placeholders for the My Jobs list */
export function JobListingCardSkeleton({
  count = 3,
  className,
}: JobListingCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-border bg-card p-5"
        >
          <div className="h-6 w-48 rounded-md bg-muted" />
          <div className="mt-3 flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-muted" />
            <div className="h-4 w-40 rounded-md bg-muted" />
          </div>
          <div className="mt-4 h-8 w-28 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-36 rounded-md bg-muted" />
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="h-11 rounded-4xl bg-muted" />
            <div className="h-11 rounded-4xl bg-muted" />
            <div className="h-11 rounded-4xl bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
