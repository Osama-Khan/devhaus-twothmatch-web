"use client";

import { useCallback, useEffect, useState } from "react";
import { chatService } from "@/features/chat/services/chat-service";
import type {
  ChatDisplayMessage,
  ChatMessage,
  ChatMessageDeliveryStatus,
  GetChatHistoryParams,
} from "@/features/chat/types";
import { isSuccessResponse } from "@/lib/types/response";

type UseChatHistoryArgs = {
  /** Prefer when known */
  threadId?: string;
  /** Used when `threadId` is omitted */
  receiverId?: string;
  /** Skip fetch until a thread/receiver is available */
  enabled?: boolean;
};

type UseChatHistoryResult = {
  messages: ChatDisplayMessage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  remainingMessagesCount: number;
  loadMore: () => void;
  refetch: () => void;
  /** Insert an optimistic outbound message (newest-first) */
  prependOptimistic: (message: ChatDisplayMessage) => void;
  /** Replace an optimistic row with the REST response (usually `sent`). */
  resolveOptimistic: (
    clientId: string,
    message: ChatMessage,
    status?: ChatMessageDeliveryStatus
  ) => void;
  /** Update delivery status by server id or client id */
  setDeliveryStatus: (
    idOrClientId: string,
    status: ChatMessageDeliveryStatus
  ) => void;
  /**
   * Inbound socket (or REST) message — dedupes by `id`, confirms matching
   * pending optimistic rows, otherwise prepends.
   */
  upsertFromSocket: (message: ChatMessage) => void;
  /**
   * Apply a peer read watermark — own messages at or before `lastReadAt`
   * become `read` (double tick).
   */
  applyPeerReadReceipt: (lastReadAt: string, currentUserId: string) => void;
};

function withSentDefaults(messages: ChatMessage[]): ChatDisplayMessage[] {
  return messages.map((message) => ({
    ...message,
    deliveryStatus: "sent" as const,
  }));
}

/**
 * Chat history for a thread with cursor load-more via `beforeMessageId`.
 * Messages are kept newest-first to match the API order.
 */
export function useChatHistory({
  threadId,
  receiverId,
  enabled = true,
}: UseChatHistoryArgs): UseChatHistoryResult {
  const [messages, setMessages] = useState<ChatDisplayMessage[]>([]);
  const [remainingMessagesCount, setRemainingMessagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  /**
   * Stable conversation identity — prefer `receiverId` so draft → thread
   * promotion (threadId appearing later) does not wipe optimistic messages.
   */
  const conversationKey = receiverId ?? threadId;
  const canFetch = enabled && Boolean(conversationKey);

  useEffect(() => {
    if (!canFetch || !conversationKey) {
      setMessages([]);
      setRemainingMessagesCount(0);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setMessages([]);
    setRemainingMessagesCount(0);

    // Prefer threadId when known; keyed fetch stays on conversationKey only
    const params: GetChatHistoryParams = threadId
      ? { threadId }
      : { receiverId: conversationKey };

    void chatService.getHistory(params).then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setMessages(withSentDefaults(response.data.messages));
        setRemainingMessagesCount(
          response.data.pagination.remainingMessagesCount
        );
      } else {
        setMessages([]);
        setRemainingMessagesCount(0);
        setError(response.error);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // Intentionally omit `threadId` — draft promotion must not remount history
    // eslint-disable-next-line react-hooks/exhaustive-deps -- conversationKey owns identity
  }, [canFetch, conversationKey, refreshKey]);

  const loadMore = useCallback(() => {
    if (
      !canFetch ||
      isLoadingMore ||
      remainingMessagesCount <= 0 ||
      messages.length === 0
    ) {
      return;
    }

    const oldest = messages[messages.length - 1];
    if (!oldest) {
      return;
    }

    setIsLoadingMore(true);
    setError(null);

    const params: GetChatHistoryParams = {
      ...(threadId ? { threadId } : { receiverId }),
      beforeMessageId: oldest.id,
    };

    void chatService.getHistory(params).then((response) => {
      if (isSuccessResponse(response)) {
        setMessages((current) => [
          ...current,
          ...withSentDefaults(response.data.messages),
        ]);
        setRemainingMessagesCount(
          response.data.pagination.remainingMessagesCount
        );
      } else {
        setError(response.error);
      }

      setIsLoadingMore(false);
    });
  }, [
    canFetch,
    isLoadingMore,
    remainingMessagesCount,
    messages,
    threadId,
    receiverId,
  ]);

  const refetch = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const prependOptimistic = useCallback((message: ChatDisplayMessage) => {
    setMessages((current) => {
      const key = message.clientId ?? message.id;
      if (
        current.some(
          (item) => item.id === message.id || item.clientId === key
        )
      ) {
        return current;
      }
      return [message, ...current];
    });
  }, []);

  const resolveOptimistic = useCallback(
    (
      clientId: string,
      message: ChatMessage,
      status: ChatMessageDeliveryStatus = "pending"
    ) => {
      setMessages((current) => {
        const index = current.findIndex(
          (item) => item.clientId === clientId || item.id === clientId
        );

        if (index < 0) {
          if (current.some((item) => item.id === message.id)) {
            return current;
          }
          return [{ ...message, clientId, deliveryStatus: status }, ...current];
        }

        const next = [...current];
        next[index] = {
          ...message,
          clientId,
          deliveryStatus: status,
        };
        return next;
      });
    },
    []
  );

  const setDeliveryStatus = useCallback(
    (idOrClientId: string, status: ChatMessageDeliveryStatus) => {
      setMessages((current) =>
        current.map((item) => {
          if (item.id !== idOrClientId && item.clientId !== idOrClientId) {
            return item;
          }
          // Don't revive an error / downgrade a read receipt
          if (item.deliveryStatus === "error" && status === "sent") {
            return item;
          }
          if (item.deliveryStatus === "read" && status === "sent") {
            return item;
          }
          return { ...item, deliveryStatus: status };
        })
      );
    },
    []
  );

  const upsertFromSocket = useCallback((message: ChatMessage) => {
    setMessages((current) => {
      const byId = current.findIndex((item) => item.id === message.id);
      if (byId >= 0) {
        const next = [...current];
        const previous = next[byId].deliveryStatus;
        next[byId] = {
          ...next[byId],
          ...message,
          clientId: next[byId].clientId,
          deliveryStatus: previous === "read" ? "read" : "sent",
        };
        return next;
      }

      const pendingIdx = current.findIndex(
        (item) =>
          item.deliveryStatus === "pending" &&
          item.senderId === message.senderId &&
          item.message === message.message
      );

      if (pendingIdx >= 0) {
        const next = [...current];
        next[pendingIdx] = {
          ...message,
          clientId: next[pendingIdx].clientId,
          deliveryStatus: "sent",
        };
        return next;
      }

      return [{ ...message, deliveryStatus: "sent" }, ...current];
    });
  }, []);

  const applyPeerReadReceipt = useCallback(
    (lastReadAt: string, currentUserId: string) => {
      const watermark = new Date(lastReadAt).getTime();
      if (!Number.isFinite(watermark)) {
        return;
      }

      setMessages((current) =>
        current.map((item) => {
          if (item.senderId !== currentUserId) {
            return item;
          }
          if (
            item.deliveryStatus === "pending" ||
            item.deliveryStatus === "error" ||
            item.deliveryStatus === "read"
          ) {
            return item;
          }
          if (new Date(item.createdAt).getTime() <= watermark) {
            return { ...item, deliveryStatus: "read" };
          }
          return item;
        })
      );
    },
    []
  );

  return {
    messages,
    isLoading,
    isLoadingMore,
    error,
    hasMore: remainingMessagesCount > 0,
    remainingMessagesCount,
    loadMore,
    refetch,
    prependOptimistic,
    resolveOptimistic,
    setDeliveryStatus,
    upsertFromSocket,
    applyPeerReadReceipt,
  };
}
