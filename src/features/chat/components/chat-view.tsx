"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatMessagePane } from "@/features/chat/components/chat-message-pane";
import { ChatThreadList } from "@/features/chat/components/chat-thread-list";
import { useChats } from "@/features/chat/hooks/use-chats";
import type { ChatMessage, ChatOtherUser } from "@/features/chat/types";
import { appRoutes } from "@/lib/routes";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

type ChatViewProps = {
  className?: string;
};

/**
 * Messenger-style chat page: ~30% thread list + ~70% message pane.
 * Supports `/chat?receiverId=` deep links (existing thread or new draft).
 */
export function ChatView({ className }: ChatViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthSelector();
  const {
    chats,
    isLoading,
    error,
    refetch,
    upsertFromOutgoing,
    clearThreadUnread,
  } = useChats();

  const receiverIdParam = searchParams.get("receiverId")?.trim() || null;
  const nameParam = searchParams.get("name")?.trim() || "Chat";
  const avatarParam = searchParams.get("avatar")?.trim() || null;

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [draftPeer, setDraftPeer] = useState<ChatOtherUser | null>(() =>
    receiverIdParam
      ? { id: receiverIdParam, name: nameParam, avatar: avatarParam }
      : null
  );

  useEffect(() => {
    if (!receiverIdParam) {
      return;
    }

    const existing = chats.find(
      (chat) => chat.otherUser.id === receiverIdParam
    );

    if (existing) {
      setSelectedThreadId(existing.threadId);
      setDraftPeer(null);
      return;
    }

    if (!isLoading) {
      setSelectedThreadId(null);
      setDraftPeer({
        id: receiverIdParam,
        name: nameParam,
        avatar: avatarParam,
      });
    }
  }, [receiverIdParam, nameParam, avatarParam, chats, isLoading]);

  const selectedChat =
    chats.find((chat) => chat.threadId === selectedThreadId) ?? null;

  const hasSelection = selectedThreadId != null || draftPeer != null;

  function clearDeepLink() {
    if (receiverIdParam) {
      router.replace(appRoutes.chat._self.path);
    }
  }

  function handleSelectThread(threadId: string) {
    setSelectedThreadId(threadId);
    setDraftPeer(null);
    clearDeepLink();
  }

  function handleBack() {
    setSelectedThreadId(null);
    setDraftPeer(null);
    clearDeepLink();
  }

  function handleOutgoingConfirmed(args: {
    threadId: string;
    message: ChatMessage;
    otherUser: ChatOtherUser;
  }) {
    upsertFromOutgoing(args);

    if (draftPeer && selectedThreadId == null) {
      setSelectedThreadId(args.threadId);
      setDraftPeer(null);
      clearDeepLink();
    }
  }

  return (
    <main
      className={cn(
        "mx-auto grid h-full max-h-3xl min-h-0 w-full max-w-7xl overflow-hidden border-l border-r border-border",
        "grid-cols-1 md:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]",
        className
      )}
    >
      <div
        className={cn(
          "min-h-0 min-w-0",
          hasSelection ? "hidden md:block" : "block"
        )}
      >
        <ChatThreadList
          chats={chats}
          selectedThreadId={selectedThreadId}
          currentUserId={user?.id}
          isLoading={isLoading}
          error={error}
          onSelect={handleSelectThread}
          onRetry={refetch}
        />
      </div>

      <div
        className={cn(
          "min-h-0 min-w-0",
          hasSelection ? "block" : "hidden md:block"
        )}
      >
        <ChatMessagePane
          chat={selectedChat}
          draftPeer={draftPeer}
          currentUserId={user?.id}
          onBack={handleBack}
          onOutgoingConfirmed={handleOutgoingConfirmed}
          onThreadRead={clearThreadUnread}
        />
      </div>
    </main>
  );
}
