import { NotificationIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function NotificationsButton() {
  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-background"
    >
      <HugeiconsIcon
        icon={NotificationIcon}
        strokeWidth={2}
        className="size-5 text-foreground"
      />
      <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
    </button>
  );
}
