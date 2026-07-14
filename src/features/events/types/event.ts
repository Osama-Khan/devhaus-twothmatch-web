/** Event pricing kind from GET `/events` */
export type EventType = "Paid" | "Free" | (string & {});

/** Event lifecycle status */
export type EventStatus = "active" | (string & {});

/** Single agenda row on an event */
export type EventAgendaItem = {
  time: string;
  activity: string;
};

/**
 * Event entity returned by GET `/events` and nested under bookings.
 * List responses include `isBooked`; booking nested `event` omits it.
 */
export type Event = {
  id: string;
  userId: string;
  type: EventType;
  description: string;
  agenda: EventAgendaItem[];
  whatsIncluded: string[];
  eventImages: string[];
  startTime: string;
  endTime: string;
  speakerInfo: string;
  cancellationPolicy: string;
  status: EventStatus;
  location: string;
  titleOfEvent: string;
  /** Decimal string amount (e.g. `"500.00"`, `"0.00"` for free) */
  amount: string;
  createdAt: string;
  updatedAt: string;
  /** Present on GET `/events` list items */
  isBooked?: boolean;
};

/** Booking identity fields (create response and list row base) */
export type EventBookingRecord = {
  id: string;
  eventId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

/** Booking row from GET `/events/bookings` with nested event */
export type EventBooking = EventBookingRecord & {
  event: Event;
};

/** Pagination metadata returned with event and booking lists */
export type EventsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** Query params for GET `/events` and GET `/events/bookings` */
export type ListEventsParams = {
  /** Page number (default 1) */
  page?: number;
  /** Page size (default 10, max 20) */
  limit?: number;
};
