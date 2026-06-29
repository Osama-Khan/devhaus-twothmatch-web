import type { UpcomingEvent } from "@/features/home/mock/home-mock-data";
import { EventItem } from "@/features/home/components/event-item";
import { cn } from "@/lib/utils";

type UpcomingEventsCardProps = {
  events: UpcomingEvent[];
  className?: string;
};

/** Left sidebar upcoming events list */
export function UpcomingEventsCard({ events, className }: UpcomingEventsCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">
          Upcoming Events
        </h2>
        <button
          type="button"
          className="text-sm font-semibold text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {events.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
