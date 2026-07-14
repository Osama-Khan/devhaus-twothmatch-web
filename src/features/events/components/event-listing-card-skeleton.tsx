import { cn } from "@/lib/utils";

type EventListingCardSkeletonProps = {
  count?: number;
  className?: string;
};

/** Loading placeholders for the events list */
export function EventListingCardSkeleton({
  count = 3,
  className,
}: EventListingCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-3xl border border-border bg-card"
        >
          <div className="aspect-16/9 bg-muted" />
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="h-6 w-48 rounded-md bg-muted" />
              <div className="h-5 w-14 rounded-full bg-muted" />
            </div>
            <div className="mt-3 h-4 w-full rounded-md bg-muted" />
            <div className="mt-2 h-4 w-[75%] rounded-md bg-muted" />
            <div className="mt-3 h-4 w-40 rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
