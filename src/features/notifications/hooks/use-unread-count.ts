"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationsService } from "@/features/notifications/services/notifications-service";
import { subscribeUnreadCountInvalidation } from "@/features/notifications/utils/unread-count-invalidation";
import { isSuccessResponse } from "@/lib/types/response";

type UseUnreadCountResult = {
  count: number;
  hasUnread: boolean;
  isLoading: boolean;
  refetch: () => void;
};

/**
 * Fetches the unread in-app notification count for the navbar badge.
 * Automatically refetches when notifications are marked read elsewhere.
 */
export function useUnreadCount(): UseUnreadCountResult {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(() => {
    void notificationsService.getUnreadCount().then((response) => {
      if (isSuccessResponse(response)) {
        setCount(response.data.count);
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    void notificationsService.getUnreadCount().then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setCount(response.data.count);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => subscribeUnreadCountInvalidation(refetch), [refetch]);

  return {
    count,
    hasUnread: count > 0,
    isLoading,
    refetch,
  };
}
