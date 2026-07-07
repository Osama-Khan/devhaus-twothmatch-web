"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationsService } from "@/features/notifications/services/notifications-service";
import type {
  Notification,
  NotificationPagination,
} from "@/features/notifications/types";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 20;

type UseNotificationHistoryResult = {
  notifications: Notification[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
};

/**
 * Paginated notification history with append-on-load-more behavior.
 */
export function useNotificationHistory(): UseNotificationHistoryResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pagination, setPagination] = useState<NotificationPagination | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void notificationsService
      .getHistory({ page: 1, limit: PAGE_SIZE })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setNotifications(response.data.notifications);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setNotifications([]);
          setPagination(null);
          setError(response.error);
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(() => {
    if (
      isLoadingMore ||
      !pagination ||
      page >= pagination.totalPages
    ) {
      return;
    }

    const nextPage = page + 1;

    setIsLoadingMore(true);
    setError(null);

    void notificationsService
      .getHistory({ page: nextPage, limit: PAGE_SIZE })
      .then((response) => {
        if (isSuccessResponse(response)) {
          setNotifications((current) => [
            ...current,
            ...response.data.notifications,
          ]);
          setPagination(response.data.pagination);
          setPage(response.data.pagination.page);
        } else {
          setError(response.error);
        }

        setIsLoadingMore(false);
      });
  }, [isLoadingMore, page, pagination]);

  const hasMore = pagination != null && page < pagination.totalPages;

  return {
    notifications,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
  };
}
