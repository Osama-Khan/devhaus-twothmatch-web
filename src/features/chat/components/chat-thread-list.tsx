"use client";

import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { BubbleChatIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
 * Left pane: searchable thread list for the messenger layout.
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
  const [query, setQuery] = useState("");

  const filteredChats = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return chats;
    }

    return chats.filter((chat) =>
      chat.otherUser.name.toLowerCase().includes(needle)
    );
  }, [chats, query]);

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border bg-card">
      <div className="shrink-0 space-y-3 border-b border-border px-4 py-4">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Chats
        </h1>
        <div className="relative">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search messages"
            className="h-10 rounded-full bg-muted/60 pl-9"
            aria-label="Search messages"
          />
        </div>
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
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12">
            <HugeiconsIcon
              icon={BubbleChatIcon}
              strokeWidth={2}
              className="size-12 text-primary"
            />
            <p className="text-center text-sm font-medium text-muted-foreground">
              {query.trim() ? "No matches." : "No chats yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 p-2">
            {filteredChats.map((chat) => (
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
