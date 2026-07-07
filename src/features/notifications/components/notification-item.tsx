"use client";

import { useRef } from "react";
import type { Notification } from "@/features/notifications/types";
import { formatNotificationTime } from "@/features/notifications/utils/format-notification-time";
import { cn } from "@/lib/utils";

const HOVER_MARK_READ_DELAY_MS = 500;

type NotificationItemProps = {
  notification: Notification;
  showDivider: boolean;
  /** When set, marks unread notifications as read after a short hover. */
  onMarkAsRead?: (notificationId: string) => void;
};

/** Single notification row in the header overlay preview or full list. */
export function NotificationItem({
  notification,
  showDivider,
  onMarkAsRead,
}: NotificationItemProps) {
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUnread = notification.readAt === null;

  function clearHoverTimer() {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }

  function handleMouseEnter() {
    if (!isUnread || !onMarkAsRead) {
      return;
    }

    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => {
      onMarkAsRead(notification.id);
      hoverTimerRef.current = null;
    }, HOVER_MARK_READ_DELAY_MS);
  }

  return (
    <article
      className={cn(
        showDivider && "border-t border-border pt-4",
        isUnread && "rounded-xl bg-secondary px-4 py-4",
        !isUnread && "py-4"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={clearHoverTimer}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">
          {notification.title}
        </h3>
        <time
          dateTime={notification.createdAt}
          className="shrink-0 text-sm font-medium text-primary"
        >
          {formatNotificationTime(notification.createdAt)}
        </time>
      </div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {notification.body}
      </p>
    </article>
  );
}
