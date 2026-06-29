import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { UpcomingEvent } from "@/features/home/mock/home-mock-data";
import { cn } from "@/lib/utils";

type EventItemProps = {
  event: UpcomingEvent;
  className?: string;
};

/** Single upcoming event row inside the events card */
export function EventItem({ event, className }: EventItemProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-background p-4",
        className
      )}
    >
      <h4 className="text-sm font-semibold text-foreground">{event.title}</h4>
      <p className="mt-2 text-xs text-muted-foreground">{event.dateTime}</p>
      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <HugeiconsIcon
          icon={Location01Icon}
          strokeWidth={2}
          className="mt-0.5 size-3.5 shrink-0"
        />
        <span>{event.location}</span>
      </div>
      <Button variant="secondary" className="mt-4 w-full" type="button">
        Register
      </Button>
    </article>
  );
}
