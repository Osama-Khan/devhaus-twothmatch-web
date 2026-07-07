"use client";

import { NotificationItem } from "@/features/notifications/components/notification-item";
import { useNotificationHistory } from "@/features/notifications/hooks/use-notification-history";
import { Button } from "@/components/ui/button";

/** Full notifications page with paginated history and load-more. */
export function NotificationsView() {
  const {
    notifications,
    isLoading,
    isLoadingMore,
    isMarkingAllRead,
    error,
    hasMore,
    hasUnread,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotificationHistory();

  return (
    <main className="mx-auto h-full min-h-0 w-full max-w-2xl overflow-y-auto px-4 py-8">
      <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-base font-bold text-foreground">Notifications</h1>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-sm font-semibold text-primary"
            disabled={!hasUnread || isMarkingAllRead || isLoading}
            onClick={markAllAsRead}
          >
            {isMarkingAllRead ? "Marking…" : "Mark all as read"}
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-20 w-full animate-pulse rounded-xl bg-muted"
              />
            ))
          ) : error ? (
            <p className="py-6 text-sm text-destructive">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
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
                  onMarkAsRead={markAsRead}
                />
              );
            })
          )}
        </div>

        {hasMore ? (
          <div className="mt-6 flex justify-center">
            <Button
              type="button"
              variant="link"
              className="h-auto py-0 text-sm font-semibold"
              disabled={isLoadingMore}
              onClick={loadMore}
            >
              {isLoadingMore ? "Loading…" : "View More"}
            </Button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
