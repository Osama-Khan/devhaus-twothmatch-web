"use client";

import type {
  BookEventResponse,
  ListEventBookingsResponse,
  ListEventsParams,
  ListEventsResponse,
} from "@/features/events/types";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";
import { createRoute } from "@/lib/utils/route";

function buildPaginatedPath(
  base: string,
  params?: ListEventsParams
): string {
  const searchParams = new URLSearchParams();

  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `${base}?${query}` : base;
}

function bookEventPath(eventId: string): string {
  return createRoute(externalApiRoutes.events.book._self, { eventId }).path;
}

/**
 * Client-side events service for listing and bookings.
 * Auth required; bookings also require a verified user.
 */
export const eventsService = {
  /**
   * GET `/events` — paginated future events for the authenticated user,
   * ordered by `startTime` ascending. Each event includes `isBooked`.
   */
  listEvents(
    params?: ListEventsParams
  ): Promise<AppResponseType<ListEventsResponse>> {
    return apiFetcher.get<ListEventsResponse>(
      buildPaginatedPath(externalApiRoutes.events._self.path, params)
    );
  },

  /**
   * GET `/events/bookings` — paginated future bookings for the authenticated
   * verified user, ordered by event `startTime` ascending. Each booking
   * includes a nested `event`.
   */
  listBookings(
    params?: ListEventsParams
  ): Promise<AppResponseType<ListEventBookingsResponse>> {
    return apiFetcher.get<ListEventBookingsResponse>(
      buildPaginatedPath(externalApiRoutes.events.bookings._self.path, params)
    );
  },

  /**
   * PUT `/events/book/:eventId` — book an event for the authenticated
   * verified user (201). No request body; `userId` comes from the JWT.
   * Fails with 400 if already booked or event ended, 404 if not found.
   */
  bookEvent(eventId: string): Promise<AppResponseType<BookEventResponse>> {
    return apiFetcher.put<BookEventResponse>(bookEventPath(eventId));
  },
};
