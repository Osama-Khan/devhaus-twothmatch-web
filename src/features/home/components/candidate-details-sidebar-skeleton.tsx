import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CandidateDetailsSidebarSkeletonProps = {
  className?: string;
};

/** Loading skeleton matching {@link CandidateDetailsSidebar} content layout */
export function CandidateDetailsSidebarSkeleton({
  className,
}: CandidateDetailsSidebarSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading candidate details"
      className={cn("mt-5 space-y-5", className)}
    >
      <section className="rounded-xl bg-muted/60 p-4">
        <Skeleton className="h-4 w-32" />
        <div className="mt-3 space-y-3">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex gap-2">
              <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full max-w-48" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="h-4 w-28" />
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-sm" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </section>

      <section>
        <Skeleton className="h-4 w-16" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </section>

      <section>
        <Skeleton className="h-4 w-28" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-7 w-32 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </section>

      <section>
        <Skeleton className="h-4 w-24" />
        <div className="mt-3 space-y-3">
          <div className="rounded-xl border border-border bg-background p-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-4 w-32" />
            <Skeleton className="mt-2 h-3 w-28" />
          </div>
        </div>
      </section>
    </div>
  );
}
