import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CandidateListingCardSkeletonProps = {
  className?: string;
};

/** Loading skeleton matching {@link CandidateListingCard} layout */
export function CandidateListingCardSkeleton({
  className,
}: CandidateListingCardSkeletonProps) {
  return (
    <article
      aria-hidden="true"
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>

      <Skeleton className="mt-4 h-6 w-2/3" />
      <Skeleton className="mt-2 h-7 w-24" />

      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-2">
            <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
            <div className="min-w-0 flex-1 space-y-1.5">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>

      <Skeleton className="mt-5 h-9 w-full rounded-md" />
    </article>
  );
}

type CandidateFeedSkeletonProps = {
  count?: number;
  className?: string;
};

/** Stacked listing card skeletons for the center candidate feed */
export function CandidateFeedSkeleton({
  count = 3,
  className,
}: CandidateFeedSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading candidates"
      className={cn("flex flex-col gap-4 w-full", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CandidateListingCardSkeleton key={index} />
      ))}
    </div>
  );
}
