"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EventDetailDialog } from "@/features/events/components/event-detail-dialog";
import { EventListingCard } from "@/features/events/components/event-listing-card";
import { EventListingCardSkeleton } from "@/features/events/components/event-listing-card-skeleton";
import { useEventBookings } from "@/features/events/hooks/use-event-bookings";
import { useEvents } from "@/features/events/hooks/use-events";
import type { Event } from "@/features/events/types";
import { cn } from "@/lib/utils";

type EventsTab = "upcoming" | "booked";

const TABS = [
  { id: "upcoming" as const, label: "Upcoming" },
  { id: "booked" as const, label: "Booked" },
];

type EventsViewProps = {
  className?: string;
};

/** Authenticated events page with Upcoming / Booked tabs */
export function EventsView({ className }: EventsViewProps) {
  const [activeTab, setActiveTab] = useState<EventsTab>("upcoming");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const {
    events,
    isLoading: isLoadingEvents,
    isLoadingMore: isLoadingMoreEvents,
    error: eventsError,
    hasMore: hasMoreEvents,
    loadMore: loadMoreEvents,
    refetch: refetchEvents,
    markBooked,
  } = useEvents();

  const {
    bookings,
    isLoading: isLoadingBookings,
    isLoadingMore: isLoadingMoreBookings,
    error: bookingsError,
    hasMore: hasMoreBookings,
    loadMore: loadMoreBookings,
    refetch: refetchBookings,
  } = useEventBookings();

  const isUpcoming = activeTab === "upcoming";

  const listEvents = useMemo((): Event[] => {
    if (isUpcoming) {
      return events;
    }

    return bookings.map((booking) => booking.event);
  }, [bookings, events, isUpcoming]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) {
      return null;
    }

    return (
      listEvents.find((event) => event.id === selectedEventId) ??
      events.find((event) => event.id === selectedEventId) ??
      null
    );
  }, [events, listEvents, selectedEventId]);

  const isLoading = isUpcoming ? isLoadingEvents : isLoadingBookings;
  const isLoadingMore = isUpcoming
    ? isLoadingMoreEvents
    : isLoadingMoreBookings;
  const error = isUpcoming ? eventsError : bookingsError;
  const hasMore = isUpcoming ? hasMoreEvents : hasMoreBookings;
  const loadMore = isUpcoming ? loadMoreEvents : loadMoreBookings;
  const refetch = isUpcoming ? refetchEvents : refetchBookings;

  function handleBooked(eventId: string) {
    markBooked(eventId);
    refetchBookings();
  }

  return (
    <main className={cn("flex h-full min-h-0 w-full flex-col", className)}>
      <ScrollArea className="h-full w-full">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Events
          </h1>

          <div className="mt-6">
            <PillTabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setSelectedEventId(null);
              }}
            />
          </div>

          <section className="mt-6">
            {isLoading ? (
              <EventListingCardSkeleton />
            ) : error && listEvents.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <p className="text-center text-sm text-destructive">{error}</p>
                <Button type="button" variant="outline" onClick={refetch}>
                  Try again
                </Button>
              </div>
            ) : listEvents.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  strokeWidth={2}
                  className="size-14 text-primary"
                />
                <p className="text-center text-base font-medium text-muted-foreground">
                  {isUpcoming
                    ? "No upcoming events."
                    : "No booked events yet."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {listEvents.map((event) => (
                  <EventListingCard
                    key={event.id}
                    event={
                      isUpcoming
                        ? event
                        : { ...event, isBooked: true }
                    }
                    onSelect={() => setSelectedEventId(event.id)}
                  />
                ))}

                {error ? (
                  <p className="text-center text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                {hasMore ? (
                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto py-0 text-sm font-semibold"
                      disabled={isLoadingMore}
                      onClick={loadMore}
                    >
                      {isLoadingMore ? "Loading…" : "Load more"}
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </ScrollArea>

      <EventDetailDialog
        event={
          selectedEvent
            ? isUpcoming
              ? selectedEvent
              : { ...selectedEvent, isBooked: true }
            : null
        }
        open={selectedEventId != null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEventId(null);
          }
        }}
        showBookingActions={isUpcoming}
        onBooked={handleBooked}
      />
    </main>
  );
}
