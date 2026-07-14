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
          className="animate-pulse overflow-hidden rounded-3xl border-l-4 border-l-muted bg-card p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="size-12 shrink-0 rounded-full bg-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-40 rounded-md bg-muted" />
              <div className="h-3.5 w-28 rounded-md bg-muted" />
              <div className="h-6 w-56 rounded-full bg-muted" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-6 w-20 rounded-full bg-muted" />
            <div className="h-4 w-24 rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
