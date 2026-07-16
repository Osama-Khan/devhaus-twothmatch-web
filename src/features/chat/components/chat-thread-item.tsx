"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import type { ChatListItem } from "@/features/chat/types";
import {
  formatChatListTime,
  formatChatPreviewText,
} from "@/features/chat/utils/format-chat-display";
import { isThreadUnreadForUser } from "@/features/chat/utils/chat-participants";
import { cn } from "@/lib/utils";

type ChatThreadItemProps = {
  chat: ChatListItem;
  selected: boolean;
  currentUserId?: string;
  onSelect: (threadId: string) => void;
};

/**
 * Single thread row in the left chat pane.
 */
export function ChatThreadItem({
  chat,
  selected,
  currentUserId,
  onSelect,
}: ChatThreadItemProps) {
  const preview = formatChatPreviewText(chat.message);
  const timeLabel = formatChatListTime(chat.timestamp);
  const isUnread = isThreadUnreadForUser(chat, currentUserId);

  return (
    <button
      type="button"
      onClick={() => onSelect(chat.threadId)}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
        selected ? "bg-primary/10" : "hover:bg-muted"
      )}
    >
      <Avatar className="size-12 shrink-0">
        {chat.otherUser.avatar ? (
          <AvatarImage src={chat.otherUser.avatar} alt={chat.otherUser.name} />
        ) : null}
        <AvatarFallback>{getInitials(chat.otherUser.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm text-foreground",
              isUnread ? "font-semibold" : "font-medium"
            )}
          >
            {chat.otherUser.name}
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {timeLabel}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2">
          <p
            className={cn(
              "min-w-0 flex-1 truncate text-xs",
              isUnread
                ? "font-medium text-foreground"
                : "text-muted-foreground"
            )}
          >
            {preview}
          </p>
          {isUnread ? (
            <span
              className="size-2 shrink-0 rounded-full bg-primary"
              aria-label="Unread"
            />
          ) : null}
        </div>
      </div>
    </button>
  );
}
