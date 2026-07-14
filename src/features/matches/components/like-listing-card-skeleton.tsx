import { cn } from "@/lib/utils";

type LikeListingCardSkeletonProps = {
  count?: number;
  className?: string;
};

/** Loading placeholders for the likes list */
export function LikeListingCardSkeleton({
  count = 3,
  className,
}: LikeListingCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-3xl bg-card p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="h-6 w-3/5 max-w-72 rounded-full bg-muted" />
              <div className="h-3.5 w-20 shrink-0 rounded-md bg-muted" />
            </div>
            <div className="flex items-start gap-3">
              <div className="size-12 shrink-0 rounded-full bg-muted" />
              <div className="min-w-0 flex-1 space-y-2 pt-1">
                <div className="h-4 w-40 rounded-md bg-muted" />
                <div className="h-3.5 w-28 rounded-md bg-muted" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
