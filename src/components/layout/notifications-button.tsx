"use client";

import { useState } from "react";
import { NotificationIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationsOverlay } from "@/features/notifications/components/notifications-overlay";
import { useUnreadCount } from "@/features/notifications/hooks/use-unread-count";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

/** Header bell trigger with unread badge and notification preview overlay. */
export function NotificationsButton() {
  const [open, setOpen] = useState(false);
  const { hasUnread, refetch } = useUnreadCount();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          aria-label="Notifications"
          className={cn(
            "relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-background",
            "data-[state=open]:bg-muted"
          )}
        >
          <HugeiconsIcon
            icon={NotificationIcon}
            strokeWidth={2}
            className="size-5 text-foreground"
          />
          {hasUnread ? (
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive"
            />
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-sm">
        <NotificationsOverlay
          open={open}
          onViewAll={() => setOpen(false)}
          onUnreadChange={refetch}
        />
      </PopoverContent>
    </Popover>
  );
}
