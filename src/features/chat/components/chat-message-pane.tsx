"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { ChatComposer } from "@/features/chat/components/chat-composer";
import { ChatEmptyPane } from "@/features/chat/components/chat-empty-pane";
import { ChatMessageBubble } from "@/features/chat/components/chat-message-bubble";
import { ChatTypingIndicator } from "@/features/chat/components/chat-typing-indicator";
import { useChatHistory } from "@/features/chat/hooks/use-chat-history";
import { useThreadSocket } from "@/features/chat/hooks/use-thread-socket";
import { chatService } from "@/features/chat/services/chat-service";
import { chatSocket } from "@/features/chat/services/chat-socket";
import type {
  ChatListItem,
  ChatMessage,
  ChatOtherUser,
  ChatSocketMessageEvent,
} from "@/features/chat/types";
import { setActiveChatPeerUserId } from "@/features/chat/utils/active-chat-session";
import { getThreadParticipantLastReadAt } from "@/features/chat/utils/chat-participants";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";

type ChatMessagePaneProps = {
  chat: ChatListItem | null;
  /** When no thread exists yet — open a new conversation by receiver */
  draftPeer?: ChatOtherUser | null;
  currentUserId?: string;
  onBack?: () => void;
  /**
   * Fired when an outbound message is confirmed via socket (or REST offline).
   * Used to patch the thread list without a full refetch.
   */
  onOutgoingConfirmed?: (args: {
    threadId: string;
    message: ChatMessage;
    otherUser: ChatOtherUser;
  }) => void;
  /** Clear unread in the parent thread list after marking read */
  onThreadRead?: (threadId: string) => void;
};

/**
 * Right pane: empty state, existing thread, or a new draft conversation.
 */
export function ChatMessagePane({
  chat,
  draftPeer = null,
  currentUserId,
  onBack,
  onOutgoingConfirmed,
  onThreadRead,
}: ChatMessagePaneProps) {
  const peer = chat?.otherUser ?? draftPeer;
  const isDraft = chat == null && draftPeer != null;
  const bottomRef = useRef<HTMLDivElement>(null);
  const markReadRef = useRef<() => void>(() => {});
  const onThreadReadRef = useRef(onThreadRead);
  const [resolvedThreadId, setResolvedThreadId] = useState<string | undefined>(
    chat?.threadId
  );

  useEffect(() => {
    onThreadReadRef.current = onThreadRead;
  }, [onThreadRead]);

  useEffect(() => {
    setResolvedThreadId(chat?.threadId);
  }, [chat?.threadId]);

  useEffect(() => {
    if (!peer?.id) {
      setActiveChatPeerUserId(null);
      return;
    }

    setActiveChatPeerUserId(peer.id);
    return () => {
      setActiveChatPeerUserId(null);
    };
  }, [peer?.id]);

  const {
    messages,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    prependOptimistic,
    resolveOptimistic,
    setDeliveryStatus,
    upsertFromSocket,
    applyPeerReadReceipt,
  } = useChatHistory({
    threadId: chat?.threadId ?? resolvedThreadId,
    // Always pass peer id so draft → thread promotion keeps the same history
    receiverId: peer?.id,
    enabled: peer != null,
  });

  const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
    // Double rAF: wait for React commit + layout of new bubbles
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior, block: "end" });
      });
    });
  }, []);

  // Jump to latest when a conversation's history finishes loading
  useEffect(() => {
    if (isLoading || !peer?.id || messages.length === 0) {
      return;
    }

    scrollToBottom("auto");
    // Only on open / peer change / load finish — not on every new message
    // eslint-disable-next-line react-hooks/exhaustive-deps -- messages.length gated intentionally
  }, [isLoading, peer?.id, scrollToBottom]);

  // Seed double-ticks from the peer's thread watermark (participants[].lastReadAt)
  useEffect(() => {
    if (!chat || !peer || !currentUserId || isLoading) {
      return;
    }

    const peerLastReadAt = getThreadParticipantLastReadAt(chat, peer.id, {
      fallbackRoot: false,
    });
    if (peerLastReadAt) {
      applyPeerReadReceipt(peerLastReadAt, currentUserId);
    }
  }, [
    applyPeerReadReceipt,
    chat,
    currentUserId,
    isLoading,
    peer,
  ]);

  const acknowledgeThreadRead = useCallback((threadId: string) => {
    void chatService.markThreadRead(threadId);
    markReadRef.current();
    onThreadReadRef.current?.(threadId);
  }, []);

  const handleSocketMessage = useCallback(
    (event: ChatSocketMessageEvent) => {
      upsertFromSocket(event.message);
      scrollToBottom("smooth");

      if (!peer || !currentUserId) {
        return;
      }

      const isOwn = event.message.senderId === currentUserId;
      if (isOwn) {
        setResolvedThreadId(event.threadId);
        onOutgoingConfirmed?.({
          threadId: event.threadId,
          message: event.message,
          otherUser: peer,
        });
        return;
      }

      // Viewing this conversation — mark read so the sender gets a receipt
      acknowledgeThreadRead(event.threadId);
    },
    [
      upsertFromSocket,
      scrollToBottom,
      peer,
      currentUserId,
      onOutgoingConfirmed,
      acknowledgeThreadRead,
    ]
  );

  const handlePeerRead = useCallback(
    (event: { userId: string; lastReadAt: string }) => {
      if (!peer || !currentUserId) {
        return;
      }
      // Only the other participant's watermark upgrades our ticks
      if (event.userId !== peer.id) {
        return;
      }
      applyPeerReadReceipt(event.lastReadAt, currentUserId);
    },
    [peer, currentUserId, applyPeerReadReceipt]
  );

  const { typingUserId, emitTyping, markRead } = useThreadSocket({
    threadId: resolvedThreadId ?? chat?.threadId,
    enabled: Boolean(resolvedThreadId ?? chat?.threadId),
    onMessage: handleSocketMessage,
    onRead: handlePeerRead,
  });

  useEffect(() => {
    markReadRef.current = markRead;
  }, [markRead]);

  const isPeerTyping =
    peer != null && typingUserId != null && typingUserId === peer.id;

  useEffect(() => {
    if (isPeerTyping) {
      scrollToBottom("smooth");
    }
  }, [isPeerTyping, scrollToBottom]);

  // Draft (no thread yet): still receive user-room `message` echoes for confirm/dedupe
  useEffect(() => {
    if (!isDraft || !draftPeer || !currentUserId) {
      return;
    }

    return chatSocket.on("message", (event) => {
      const { message } = event;
      const involvesPeer =
        message.senderId === draftPeer.id ||
        message.receiverId === draftPeer.id;

      if (!involvesPeer) {
        return;
      }

      handleSocketMessage(event);
    });
  }, [isDraft, draftPeer, currentUserId, handleSocketMessage]);

  // Mark the open thread as read whenever this pane has a thread
  useEffect(() => {
    const threadId = chat?.threadId ?? resolvedThreadId;
    if (!threadId) {
      return;
    }

    acknowledgeThreadRead(threadId);
  }, [chat?.threadId, resolvedThreadId, acknowledgeThreadRead]);

  if (!peer) {
    return (
      <section className="flex h-full min-h-0 flex-col bg-background">
        <ChatEmptyPane />
      </section>
    );
  }

  const activePeer = peer;
  const receiverId = activePeer.id;

  async function handleSend(payload: { message: string; files: File[] }) {
    if (!currentUserId) {
      return;
    }

    const clientId = crypto.randomUUID();
    const text =
      payload.message.trim() ||
      (payload.files.length > 0 ? "Uploaded" : "");

    const objectUrls: string[] = [];
    const optimisticAttachments = payload.files.map((file, index) => {
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      return {
        id: `${clientId}-att-${index}`,
        url,
        kind: "chat_attachment" as const,
      };
    });

    prependOptimistic({
      id: clientId,
      clientId,
      senderId: currentUserId,
      receiverId,
      message: text,
      createdAt: new Date().toISOString(),
      attachments: optimisticAttachments,
      deliveryStatus: "pending",
    });
    scrollToBottom("smooth");

    const response =
      payload.files.length > 0
        ? await chatService.sendFile({
            receiverId,
            caption: payload.message.trim() || undefined,
            files: payload.files,
          })
        : await chatService.sendMessage({
            receiverId,
            message: payload.message.trim(),
          });

    for (const url of objectUrls) {
      URL.revokeObjectURL(url);
    }

    if (!isSuccessResponse(response)) {
      setDeliveryStatus(clientId, "error");
      return;
    }

    const serverMessage = response.data.message;
    resolveOptimistic(clientId, serverMessage, "sent");

    const threadId = resolvedThreadId ?? chat?.threadId;
    if (threadId) {
      onOutgoingConfirmed?.({
        threadId,
        message: serverMessage,
        otherUser: activePeer,
      });
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-col bg-background">
      <header className="flex shrink-0 items-center gap-3 border-b border-border bg-card px-3 py-3 sm:px-4">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 md:hidden"
            aria-label="Back to chats"
            onClick={onBack}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} />
          </Button>
        ) : null}

        <UserAvatar
          userId={activePeer.id}
          name={activePeer.name}
          src={activePeer.avatar}
          showPresence
          className="size-10 shrink-0"
        />

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-foreground">
            {activePeer.name}
          </h2>
          {isPeerTyping ? (
            <p className="truncate text-xs text-primary">typing…</p>
          ) : null}
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-3 px-3 py-4 sm:px-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={cn(
                    "h-12 w-2/3 rounded-2xl",
                    index % 2 === 0 ? "ml-auto" : "mr-auto"
                  )}
                />
              ))}
            </div>
          ) : error && messages.length === 0 && !isDraft ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 py-12">
              <p className="text-center text-sm text-destructive">{error}</p>
            </div>
          ) : messages.length === 0 && !isPeerTyping ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
              <p className="text-sm text-muted-foreground">
                No messages yet. Say hello!
              </p>
            </div>
          ) : (
            <div className="flex min-h-full flex-col justify-end gap-3 px-3 py-4 sm:px-4">
              {hasMore ? (
                <div className="flex justify-center pb-1">
                  <Button
                    type="button"
                    variant="link"
                    className="h-auto py-0 text-sm font-semibold"
                    disabled={isLoadingMore}
                    onClick={loadMore}
                  >
                    {isLoadingMore ? "Loading…" : "Load earlier messages"}
                  </Button>
                </div>
              ) : null}

              {/* API is newest-first; render oldest → newest for bottom anchoring */}
              {[...messages].reverse().map((message) => (
                <ChatMessageBubble
                  key={message.clientId ?? message.id}
                  message={message}
                  isOwn={
                    currentUserId != null && message.senderId === currentUserId
                  }
                />
              ))}

              {isPeerTyping ? (
                <ChatTypingIndicator name={activePeer.name} />
              ) : null}

              <div ref={bottomRef} aria-hidden className="h-px w-full shrink-0" />
            </div>
          )}
        </ScrollArea>
      </div>

      <ChatComposer onSend={handleSend} onTyping={emitTyping} />
    </section>
  );
}
