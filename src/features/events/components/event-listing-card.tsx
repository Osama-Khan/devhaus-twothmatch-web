"use client";

import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/features/events/types";
import {
  formatEventDate,
  getEventCoverImage,
} from "@/features/events/utils/format-event-display";
import { cn } from "@/lib/utils";

type EventListingCardProps = {
  event: Event;
  onSelect: () => void;
  className?: string;
};

/** Event list card with cover image, title, truncated description, and date */
export function EventListingCard({
  event,
  onSelect,
  className,
}: EventListingCardProps) {
  const coverImage = getEventCoverImage(event);
  const isBooked = event.isBooked === true;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "cursor-pointer overflow-hidden rounded-3xl bg-card shadow-sm outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="relative aspect-16/9 bg-muted">
        {coverImage ? (
          <Image
            src={coverImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 48rem"
            unoptimized
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <HugeiconsIcon
              icon={Calendar03Icon}
              strokeWidth={2}
              className="size-12 text-muted-foreground/50"
            />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 text-xl font-semibold text-foreground">
            {event.titleOfEvent}
          </h3>
          {isBooked ? <Badge variant="soft">Booked</Badge> : null}
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {event.description}
        </p>

        <p className="mt-3 text-sm font-medium text-foreground">
          {formatEventDate(event.startTime)}
        </p>
      </div>
    </article>
  );
}
