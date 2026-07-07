"use client";

import { NotificationItem } from "@/features/notifications/components/notification-item";
import { useNotificationPreview } from "@/features/notifications/hooks/use-notification-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NotificationsOverlayProps = {
  open: boolean;
};

/** Popover panel listing the three most recent notifications. */
export function NotificationsOverlay({ open }: NotificationsOverlayProps) {
  const { notifications, isLoading, error } = useNotificationPreview(open);

  return (
    <div className="flex flex-col">
      <h2 className="text-base font-bold text-foreground">Notifications</h2>

      <div
        className={cn(
          "mt-4 flex flex-col gap-2",
          notifications.some((n) => n.readAt === null) && "gap-2"
        )}
      >
        {isLoading ? (
          [1, 2, 3].map((item) => (
            <div
              key={item}
              className="py-6 text-sm animate-pulse bg-muted rounded-xl h-20 w-full"
            ></div>
          ))
        ) : error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground">
            No notifications yet.
          </p>
        ) : (
          notifications.map((notification, index) => {
            const isUnread = notification.readAt === null;
            const showDivider = !isUnread && index > 0;

            return (
              <NotificationItem
                key={notification.id}
                notification={notification}
                showDivider={showDivider}
              />
            );
          })
        )}
      </div>

      <Button
        type="button"
        variant="link"
        className="mt-4 h-auto w-full py-0 text-sm font-semibold"
      >
        View All
      </Button>
    </div>
  );
}
