"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  BubbleChatIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatThreadItem } from "@/features/chat/components/chat-thread-item";
import { ChatThreadListSkeleton } from "@/features/chat/components/chat-thread-list-skeleton";
import { useChats } from "@/features/chat/hooks/use-chats";
import { buildChatPath } from "@/features/chat/utils/build-chat-path";
import { isThreadUnreadForUser } from "@/features/chat/utils/chat-participants";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

/**
 * Fixed bottom-right Messaging launcher.
 * Collapsed: tab label. Expanded: searchable thread list (opens full `/chat`).
 */
export function MessagingDock() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthSelector();
  const { chats, isLoading, error, refetch } = useChats();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const unreadCount = useMemo(() => {
    return chats.reduce(
      (count, chat) =>
        isThreadUnreadForUser(chat, user?.id) ? count + 1 : count,
      0
    );
  }, [chats, user?.id]);

  const filteredChats = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return chats;
    }

    return chats.filter((chat) =>
      chat.otherUser.name.toLowerCase().includes(needle)
    );
  }, [chats, query]);

  // Full chat page already has the messenger UI
  if (pathname === appRoutes.chat._self.path) {
    return null;
  }

  function handleSelectThread(threadId: string) {
    const chat = chats.find((item) => item.threadId === threadId);
    if (!chat) {
      return;
    }

    setOpen(false);
    setQuery("");
    router.push(
      buildChatPath({
        receiverId: chat.otherUser.id,
        name: chat.otherUser.name,
        avatar: chat.otherUser.avatar,
      })
    );
  }

  return (
    <div
      className={cn(
        "fixed right-4 bottom-0 z-40 flex w-[min(100%-2rem,22.5rem)] flex-col",
        "pointer-events-none sm:right-6"
      )}
    >
      <div
        className={cn(
          "pointer-events-auto flex flex-col overflow-hidden border border-b-0 border-border bg-card shadow-lg",
          "rounded-t-2xl transition-[height] duration-200 ease-out",
          open ? "h-[min(70vh,32rem)]" : "h-14"
        )}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls="messaging-dock-panel"
          onClick={() => setOpen((current) => !current)}
          className={cn(
            "flex h-14 w-full shrink-0 items-center justify-between gap-3 px-5 text-left",
            "bg-card transition-colors hover:bg-muted/40",
            open && "border-b border-border"
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="truncate text-base font-bold text-foreground">
              Messaging
            </span>
            {unreadCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </span>
          <HugeiconsIcon
            icon={open ? ArrowDown01Icon : ArrowUp01Icon}
            strokeWidth={2}
            className="size-5 shrink-0 text-muted-foreground"
          />
        </button>

        {open ? (
          <div
            id="messaging-dock-panel"
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="shrink-0 px-3 pt-3 pb-2">
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
                <div className="flex flex-col items-center gap-3 px-4 py-10">
                  <p className="text-center text-sm text-destructive">{error}</p>
                  <Button type="button" variant="outline" size="sm" onClick={refetch}>
                    Try again
                  </Button>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-4 py-10">
                  <HugeiconsIcon
                    icon={BubbleChatIcon}
                    strokeWidth={2}
                    className="size-10 text-primary"
                  />
                  <p className="text-center text-sm font-medium text-muted-foreground">
                    {query.trim() ? "No matches." : "No chats yet."}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5 px-1.5 pb-2">
                  {filteredChats.map((chat) => (
                    <ChatThreadItem
                      key={chat.threadId}
                      chat={chat}
                      selected={false}
                      currentUserId={user?.id}
                      onSelect={handleSelectThread}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        ) : null}
      </div>
    </div>
  );
}
