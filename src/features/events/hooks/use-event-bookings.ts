"use client";

import { useCallback, useEffect, useState } from "react";
import { eventsService } from "@/features/events/services/events-service";
import type { EventBooking, EventsPagination } from "@/features/events/types";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseEventBookingsResult = {
  bookings: EventBooking[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
};

/**
 * Fetches paginated future event bookings with append-on-load-more.
 */
export function useEventBookings(): UseEventBookingsResult {
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [pagination, setPagination] = useState<EventsPagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setBookings([]);
    setPagination(null);
    setPage(1);

    void eventsService
      .listBookings({ page: 1, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setBookings(response.data.bookings);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setBookings([]);
          setPagination(null);
          setError(response.error);
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !pagination || page >= pagination.totalPages) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    void eventsService
      .listBookings({ page: nextPage, limit: PAGE_SIZE })
      .then((response) => {
        if (isSuccessResponse(response)) {
          setBookings((current) => [...current, ...response.data.bookings]);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setError(response.error);
        }

        setIsLoadingMore(false);
      });
  }, [isLoadingMore, page, pagination]);

  const refetch = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const hasMore = pagination != null && page < pagination.totalPages;

  return {
    bookings,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}
