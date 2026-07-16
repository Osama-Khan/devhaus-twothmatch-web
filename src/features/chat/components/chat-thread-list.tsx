"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { BubbleChatIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatThreadItem } from "@/features/chat/components/chat-thread-item";
import { ChatThreadListSkeleton } from "@/features/chat/components/chat-thread-list-skeleton";
import type { ChatListItem } from "@/features/chat/types";

type ChatThreadListProps = {
  chats: ChatListItem[];
  selectedThreadId: string | null;
  currentUserId?: string;
  isLoading: boolean;
  error: string | null;
  onSelect: (threadId: string) => void;
  onRetry: () => void;
};

/**
 * Left pane: searchable-feel thread list for the messenger layout.
 */
export function ChatThreadList({
  chats,
  selectedThreadId,
  currentUserId,
  isLoading,
  error,
  onSelect,
  onRetry,
}: ChatThreadListProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border bg-card">
      <div className="shrink-0 border-b border-border px-4 py-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Chats
        </h1>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {isLoading ? (
          <ChatThreadListSkeleton />
        ) : error && chats.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-4 py-12">
            <p className="text-center text-sm text-destructive">{error}</p>
            <Button type="button" variant="outline" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12">
            <HugeiconsIcon
              icon={BubbleChatIcon}
              strokeWidth={2}
              className="size-12 text-primary"
            />
            <p className="text-center text-sm font-medium text-muted-foreground">
              No chats yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 p-2">
            {chats.map((chat) => (
              <ChatThreadItem
                key={chat.threadId}
                chat={chat}
                selected={chat.threadId === selectedThreadId}
                currentUserId={currentUserId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
