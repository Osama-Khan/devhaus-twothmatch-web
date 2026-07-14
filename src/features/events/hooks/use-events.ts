"use client";

import { useCallback, useEffect, useState } from "react";
import { eventsService } from "@/features/events/services/events-service";
import type { Event, EventsPagination } from "@/features/events/types";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseEventsResult = {
  events: Event[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
};

/**
 * Fetches paginated future events with append-on-load-more.
 */
export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<Event[]>([]);
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
    setEvents([]);
    setPagination(null);
    setPage(1);

    void eventsService.listEvents({ page: 1, limit: PAGE_SIZE }).then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setEvents(response.data.events);
        setPagination(response.data.pagination);
        setPage(response.data.pagination.page);
      } else {
        setEvents([]);
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
      .listEvents({ page: nextPage, limit: PAGE_SIZE })
      .then((response) => {
        if (isSuccessResponse(response)) {
          setEvents((current) => [...current, ...response.data.events]);
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
    events,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}
