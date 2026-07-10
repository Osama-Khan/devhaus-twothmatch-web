"use client";

import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { notificationsService } from "@/features/notifications/services/notifications-service";
import type { Notification } from "@/features/notifications/types";
import { invalidateUnreadCount } from "@/features/notifications/utils/unread-count-invalidation";
import { isSuccessResponse } from "@/lib/types/response";

type UseNotificationMarkActionsParams = {
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
  /** Called after a notification is successfully marked read. */
  onMarkedRead?: () => void;
};

type UseNotificationMarkActionsResult = {
  hasUnread: boolean;
  isMarkingAllRead: boolean;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
};

/**
 * Shared optimistic mark-read handlers for notification lists.
 */
export function useNotificationMarkActions({
  notifications,
  setNotifications,
  setError,
  onMarkedRead,
}: UseNotificationMarkActionsParams): UseNotificationMarkActionsResult {
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const notificationsRef = useRef(notifications);

  notificationsRef.current = notifications;

  const markAsRead = useCallback(
    (notificationId: string) => {
      const target = notificationsRef.current.find(
        (notification) => notification.id === notificationId
      );

      if (!target || target.readAt !== null) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? { ...notification, readAt: new Date().toISOString() }
            : notification
        )
      );

      void notificationsService.markAsRead(notificationId).then((response) => {
        if (isSuccessResponse(response)) {
          invalidateUnreadCount();
          onMarkedRead?.();
          return;
        }

        setNotifications((current) =>
          current.map((notification) =>
            notification.id === notificationId
              ? { ...notification, readAt: null }
              : notification
          )
        );
        setError(response.error);
      });
    },
    [onMarkedRead, setError, setNotifications]
  );

  const markAllAsRead = useCallback(() => {
    if (isMarkingAllRead) {
      return;
    }

    const unreadExists = notificationsRef.current.some(
      (notification) => notification.readAt === null
    );

    if (!unreadExists) {
      return;
    }

    const previousNotifications = notificationsRef.current;
    const readAt = new Date().toISOString();

    setNotifications((current) =>
      current.map((notification) =>
        notification.readAt === null ? { ...notification, readAt } : notification
      )
    );
    setIsMarkingAllRead(true);
    setError(null);

    void notificationsService.markAllAsRead().then((response) => {
      if (isSuccessResponse(response)) {
        invalidateUnreadCount();
        onMarkedRead?.();
      } else {
        setNotifications(previousNotifications);
        setError(response.error);
      }

      setIsMarkingAllRead(false);
    });
  }, [isMarkingAllRead, onMarkedRead, setError, setNotifications]);

  const hasUnread = notifications.some(
    (notification) => notification.readAt === null
  );

  return {
    hasUnread,
    isMarkingAllRead,
    markAsRead,
    markAllAsRead,
  };
}
