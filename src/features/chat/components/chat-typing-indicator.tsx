"use client";

import { cn } from "@/lib/utils";

type ChatTypingIndicatorProps = {
  /** Peer display name for accessibility */
  name?: string;
  className?: string;
};

/**
 * Animated “typing…” bubble shown while the other participant is typing.
 */
export function ChatTypingIndicator({
  name,
  className,
}: ChatTypingIndicatorProps) {
  return (
    <div
      className={cn("flex w-full justify-start", className)}
      aria-live="polite"
      aria-label={name ? `${name} is typing` : "Someone is typing"}
    >
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-card px-3.5 py-3 shadow-sm ring-1 ring-border">
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:0ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:150ms]" />
        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
