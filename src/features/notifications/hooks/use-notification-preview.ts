"use client";

import { useEffect, useState } from "react";
import { useNotificationMarkActions } from "@/features/notifications/hooks/use-notification-mark-actions";
import { notificationsService } from "@/features/notifications/services/notifications-service";
import type { Notification } from "@/features/notifications/types";
import { isSuccessResponse } from "@/lib/types/response";

const PREVIEW_LIMIT = 3;

type UseNotificationPreviewOptions = {
  onMarkedRead?: () => void;
};

type UseNotificationPreviewResult = {
  notifications: Notification[];
  isLoading: boolean;
  isMarkingAllRead: boolean;
  error: string | null;
  hasUnread: boolean;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
};

/**
 * Loads the latest notifications when the overlay is open.
 */
export function useNotificationPreview(
  open: boolean,
  options: UseNotificationPreviewOptions = {}
): UseNotificationPreviewResult {
  const { onMarkedRead } = options;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { hasUnread, isMarkingAllRead, markAsRead, markAllAsRead } =
    useNotificationMarkActions({
      notifications,
      setNotifications,
      setError,
      onMarkedRead,
    });

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
    isMarkingAllRead,
    error,
    hasUnread,
    markAsRead,
    markAllAsRead,
  };
}
