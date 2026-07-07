"use client";

import { useEffect, useState } from "react";
import { notificationsService } from "@/features/notifications/services/notifications-service";
import type { Notification } from "@/features/notifications/types";
import { isSuccessResponse } from "@/lib/types/response";

const PREVIEW_LIMIT = 3;

type UseNotificationPreviewResult = {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Loads the latest notifications when the overlay is open.
 */
export function useNotificationPreview(
  open: boolean
): UseNotificationPreviewResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void notificationsService
      .getHistory({ page: 1, limit: PREVIEW_LIMIT })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications([]);
          setError(response.error);
        }

        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  return {
    notifications,
    isLoading,
    error,
  };
}
