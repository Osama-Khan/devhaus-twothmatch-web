import type { ChatListItem, ChatThreadParticipant } from "@/features/chat/types";

/**
 * Resolve a participant's `lastReadAt` on a thread.
 * Prefers `participants[]`; falls back to root `lastReadAt` for the current
 * user when the API only returns the authenticated watermark.
 */
export function getThreadParticipantLastReadAt(
  chat: Pick<ChatListItem, "participants" | "lastReadAt">,
  userId: string,
  options?: { /** Use root `lastReadAt` when participant row is missing */ fallbackRoot?: boolean }
): string | null {
  const participant = chat.participants?.find((item) => item.userId === userId);
  if (participant) {
    return participant.lastReadAt;
  }

  if (options?.fallbackRoot !== false) {
    return chat.lastReadAt ?? null;
  }

  return null;
}

/** Whether the current user still has unread messages in this thread. */
export function isThreadUnreadForUser(
  chat: ChatListItem,
  currentUserId: string | undefined
): boolean {
  if (!currentUserId) {
    return false;
  }

  if (chat.message.senderId === currentUserId) {
    return false;
  }

  const myLastReadAt = getThreadParticipantLastReadAt(chat, currentUserId);
  return (
    myLastReadAt == null ||
    new Date(myLastReadAt).getTime() < new Date(chat.timestamp).getTime()
  );
}

/** Patch (or append) a participant watermark on a thread row. */
export function withParticipantLastReadAt(
  chat: ChatListItem,
  userId: string,
  lastReadAt: string
): ChatListItem {
  const participants: ChatThreadParticipant[] = chat.participants
    ? chat.participants.map((item) =>
        item.userId === userId ? { ...item, lastReadAt } : item
      )
    : [];

  if (!participants.some((item) => item.userId === userId)) {
    participants.push({ userId, lastReadAt });
  }

  return {
    ...chat,
    lastReadAt,
    participants,
  };
}
