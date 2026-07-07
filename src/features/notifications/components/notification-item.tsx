import type { Notification } from "@/features/notifications/types";
import { formatNotificationTime } from "@/features/notifications/utils/format-notification-time";
import { cn } from "@/lib/utils";

type NotificationItemProps = {
  notification: Notification;
  showDivider: boolean;
};

/** Single notification row in the header overlay preview. */
export function NotificationItem({
  notification,
  showDivider,
}: NotificationItemProps) {
  const isUnread = notification.readAt === null;

  return (
    <article
      className={cn(
        showDivider && "border-t border-border pt-4",
        isUnread && "rounded-xl bg-secondary px-4 py-4",
        !isUnread && "py-4"
      )}
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
