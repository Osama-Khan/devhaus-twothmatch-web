"use client";

import { useEffect, useState } from "react";
import { notificationsService } from "@/features/notifications/services/notifications-service";
import { isSuccessResponse } from "@/lib/types/response";

type UseUnreadCountResult = {
  count: number;
  hasUnread: boolean;
  isLoading: boolean;
};

/**
 * Fetches the unread in-app notification count for the navbar badge.
 */
export function useUnreadCount(): UseUnreadCountResult {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    count,
    hasUnread: count > 0,
    isLoading,
  };
}
