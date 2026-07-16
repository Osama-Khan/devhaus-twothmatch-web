"use client";

import { useCallback, useEffect, useState } from "react";
import { chatService } from "@/features/chat/services/chat-service";
import { chatSocket } from "@/features/chat/services/chat-socket";
import type {
  ChatListItem,
  ChatListMessage,
  ChatMessage,
  ChatOtherUser,
} from "@/features/chat/types";
import { getActiveChatPeerUserId } from "@/features/chat/utils/active-chat-session";
import { withParticipantLastReadAt } from "@/features/chat/utils/chat-participants";
import { useAuthSelector } from "@/lib/store/hooks";
import { isSuccessResponse } from "@/lib/types/response";

type UpsertChatArgs = {
  threadId?: string;
  otherUser: ChatOtherUser;
  message: ChatMessage;
  /** When true, clear unread for this thread (viewer has it open) */
  markRead?: boolean;
  /** Current user — used to patch `participants[].lastReadAt` when marking read */
  currentUserId?: string;
};

type UseChatsResult = {
  chats: ChatListItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  /**
   * Move/update a thread preview and re-sort to top (no full list refetch).
   * Creates a row when `threadId` is known for a new chat.
   */
  upsertFromOutgoing: (args: UpsertChatArgs) => void;
  /** Clear unread locally for a thread (does not call the API). */
  clearThreadUnread: (threadId: string) => void;
};

function toListPreview(message: ChatMessage): ChatListMessage {
  return {
    id: message.id,
    senderId: message.senderId,
    message: message.message,
    attachments: message.attachments,
  };
}

function upsertChatList(
  current: ChatListItem[],
  args: UpsertChatArgs
): ChatListItem[] {
  const preview = toListPreview(args.message);
  const index = current.findIndex(
    (chat) =>
      (args.threadId != null && chat.threadId === args.threadId) ||
      chat.otherUser.id === args.otherUser.id
  );

  if (index >= 0) {
    const existing = current[index];
    let updated: ChatListItem = {
      ...existing,
      threadId: args.threadId ?? existing.threadId,
      timestamp: args.message.createdAt,
      message: preview,
      otherUser: {
        ...existing.otherUser,
        ...args.otherUser,
        name: args.otherUser.name || existing.otherUser.name,
        avatar: args.otherUser.avatar ?? existing.otherUser.avatar,
      },
    };

    if (args.markRead && args.currentUserId) {
      updated = withParticipantLastReadAt(
        updated,
        args.currentUserId,
        args.message.createdAt
      );
    }

    return [updated, ...current.filter((_, itemIndex) => itemIndex !== index)];
  }

  if (!args.threadId) {
    return current;
  }

  let created: ChatListItem = {
    threadId: args.threadId,
    otherUser: args.otherUser,
    timestamp: args.message.createdAt,
    message: preview,
    lastReadAt: null,
    muted: false,
    archived: false,
  };

  if (args.markRead && args.currentUserId) {
    created = withParticipantLastReadAt(
      created,
      args.currentUserId,
      args.message.createdAt
    );
  }

  return [created, ...current];
}

/**
 * Chat thread list with REST load + live socket preview updates / re-sort.
 */
export function useChats(): UseChatsResult {
  const { user } = useAuthSelector();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void chatService.listChats().then((response) => {
      if (cancelled) {
        return;
      }

      if (isSuccessResponse(response)) {
        setChats(response.data.chats);
      } else {
        setChats([]);
        setError(response.error);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    const currentUserId = user?.id;
    if (!currentUserId) {
      return;
    }

    return chatSocket.on("message", (event) => {
      const { threadId, message } = event;
      const peerId =
        message.senderId === currentUserId
          ? message.receiverId
          : message.senderId;

      if (!peerId) {
        return;
      }

      const isOwn = message.senderId === currentUserId;
      const isActiveConversation = getActiveChatPeerUserId() === peerId;

      if (isActiveConversation) {
        void chatService.markThreadRead(threadId);
      }

      setChats((current) => {
        const existing = current.find(
          (chat) =>
            chat.threadId === threadId || chat.otherUser.id === peerId
        );

        return upsertChatList(current, {
          threadId,
          otherUser: existing?.otherUser ?? {
            id: peerId,
            name: "Chat",
            avatar: null,
          },
          message,
          markRead: isOwn || isActiveConversation,
          currentUserId,
        });
      });
    });
  }, [user?.id]);

  const refetch = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  const upsertFromOutgoing = useCallback(
    (args: UpsertChatArgs) => {
      setChats((current) =>
        upsertChatList(current, {
          ...args,
          markRead: args.markRead ?? true,
          currentUserId: args.currentUserId ?? user?.id,
        })
      );
    },
    [user?.id]
  );

  const clearThreadUnread = useCallback(
    (threadId: string) => {
      const userId = user?.id;
      const now = new Date().toISOString();
      setChats((current) =>
        current.map((chat) => {
          if (chat.threadId !== threadId) {
            return chat;
          }
          if (!userId) {
            return { ...chat, lastReadAt: now };
          }
          return withParticipantLastReadAt(chat, userId, now);
        })
      );
    },
    [user?.id]
  );

  return {
    chats,
    isLoading,
    error,
    refetch,
    upsertFromOutgoing,
    clearThreadUnread,
  };
}
