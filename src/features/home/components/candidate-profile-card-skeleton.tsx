import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CandidateProfileCardSkeletonProps = {
  className?: string;
};

/** Loading skeleton matching {@link CandidateProfileCard} layout */
export function CandidateProfileCardSkeleton({
  className,
}: CandidateProfileCardSkeletonProps) {
  return (
    <article
      aria-busy="true"
      aria-label="Loading candidate profile"
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <Skeleton className="aspect-4/3 w-full rounded-none" />

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/5" />
          </div>
        </div>

        <div className="rounded-xl bg-muted/60 p-4">
          <Skeleton className="h-4 w-24" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </div>
      </div>
    </article>
  );
}
