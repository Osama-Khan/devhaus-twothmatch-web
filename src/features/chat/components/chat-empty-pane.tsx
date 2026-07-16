"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { BubbleChatIcon } from "@hugeicons/core-free-icons";

/** Right-pane placeholder when no thread is selected */
export function ChatEmptyPane() {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-3 px-6 text-center">
      <HugeiconsIcon
        icon={BubbleChatIcon}
        strokeWidth={1.75}
        className="size-16 text-primary"
      />
      <p className="text-base font-medium text-muted-foreground">
        Choose a chat to view messages
      </p>
    </div>
  );
}
