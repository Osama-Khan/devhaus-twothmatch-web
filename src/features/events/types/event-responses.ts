import type {
  Event,
  EventBooking,
  EventBookingRecord,
  EventsPagination,
} from "@/features/events/types/event";

/** Response from GET `/events` */
export type ListEventsResponse = {
  events: Event[];
  pagination: EventsPagination;
};

/** Response from GET `/events/bookings` */
export type ListEventBookingsResponse = {
  bookings: EventBooking[];
  pagination: EventsPagination;
};

/** Response from PUT `/events/book/:eventId` (201) */
export type BookEventResponse = {
  booking: EventBookingRecord;
};
