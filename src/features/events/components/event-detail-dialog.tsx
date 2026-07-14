"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { eventsService } from "@/features/events/services/events-service";
import type { Event } from "@/features/events/types";
import {
  formatEventDateRange,
  formatEventPrice,
  getEventCoverImage,
} from "@/features/events/utils/format-event-display";
import { isSuccessResponse } from "@/lib/types/response";

type EventDetailDialogProps = {
  event: Event | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Hide Booked badge and Book button (Booked tab) */
  showBookingActions?: boolean;
  onBooked?: (eventId: string) => void;
};

/** Event detail dialog with optional book action */
export function EventDetailDialog({
  event,
  open,
  onOpenChange,
  showBookingActions = true,
  onBooked,
}: EventDetailDialogProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [localBooked, setLocalBooked] = useState(false);

  useEffect(() => {
    setLocalBooked(false);
  }, [event?.id]);

  const isBooked = event?.isBooked === true || localBooked;
  const coverImage = event ? getEventCoverImage(event) : null;

  async function bookEvent() {
    if (!event || isBooking || isBooked) {
      return;
    }

    setIsBooking(true);

    const response = await eventsService.bookEvent(event.id);

    if (isSuccessResponse(response)) {
      setLocalBooked(true);
      onBooked?.(event.id);
      toast.success("Event booked");
    } else {
      toast.error(response.error);
    }

    setIsBooking(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isBooking) {
          return;
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton={!isBooking}
      >
        {event ? (
          <>
            <div className="relative aspect-16/9 bg-muted">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32rem"
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

            <ScrollArea className="max-h-[min(50vh,24rem)]">
              <div className="space-y-4 p-6">
                <DialogHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3 pr-8">
                    <DialogTitle className="text-xl font-semibold leading-snug">
                      {event.titleOfEvent}
                    </DialogTitle>
                    {showBookingActions && isBooked ? (
                      <Badge variant="soft">Booked</Badge>
                    ) : null}
                  </div>
                  <DialogDescription className="text-left text-sm leading-relaxed">
                    {event.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {formatEventDateRange(event.startTime, event.endTime)}
                  </p>
                  <div className="flex items-start gap-1.5">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      strokeWidth={2}
                      className="mt-0.5 size-3.5 shrink-0"
                    />
                    <span>{event.location}</span>
                  </div>
                  <p className="font-semibold text-primary">
                    {formatEventPrice(event)}
                  </p>
                </div>

                {event.agenda.length > 0 ? (
                  <section>
                    <h4 className="text-sm font-semibold text-foreground">
                      Agenda
                    </h4>
                    <ul className="mt-2 space-y-1.5">
                      {event.agenda.map((item) => (
                        <li
                          key={`${item.time}-${item.activity}`}
                          className="flex gap-3 text-sm text-muted-foreground"
                        >
                          <span className="w-12 shrink-0 font-medium text-foreground">
                            {item.time}
                          </span>
                          <span>{item.activity}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {event.whatsIncluded.length > 0 ? (
                  <section>
                    <h4 className="text-sm font-semibold text-foreground">
                      What&apos;s included
                    </h4>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {event.whatsIncluded.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {event.speakerInfo ? (
                  <section>
                    <h4 className="text-sm font-semibold text-foreground">
                      Speakers
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.speakerInfo}
                    </p>
                  </section>
                ) : null}

                {event.cancellationPolicy ? (
                  <section>
                    <h4 className="text-sm font-semibold text-foreground">
                      Cancellation policy
                    </h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {event.cancellationPolicy}
                    </p>
                  </section>
                ) : null}
              </div>
            </ScrollArea>

            {showBookingActions ? (
              <DialogFooter className="border-t border-border p-6 sm:justify-stretch">
                <Button
                  type="button"
                  variant="default"
                  className="w-full"
                  disabled={isBooked || isBooking}
                  onClick={() => void bookEvent()}
                >
                  {isBooking ? "Booking…" : isBooked ? "Booked" : "Book"}
                </Button>
              </DialogFooter>
            ) : null}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
