/** Attachment `kind` on chat messages (files only) */
export type ChatAttachmentKind = "chat_attachment";

/** Max characters for text message / file caption */
export const CHAT_MESSAGE_MAX_LENGTH = 1000;

/** Max files per send-file request */
export const CHAT_SEND_FILE_MAX_COUNT = 5;

/** Max bytes per chat attachment (50MB) */
export const CHAT_SEND_FILE_MAX_BYTES = 50 * 1024 * 1024;

/** Up to this many messages per history request */
export const CHAT_HISTORY_PAGE_SIZE = 30;

/** File attachment on a chat message */
export type ChatAttachment = {
  id: string;
  url: string;
  kind: ChatAttachmentKind;
};

/**
 * Message row from history / send responses.
 * History items omit `receiverId`; send responses include it.
 */
export type ChatMessage = {
  id: string;
  senderId: string;
  receiverId?: string;
  message: string;
  createdAt: string;
  attachments: ChatAttachment[];
};

/**
 * Local delivery state for outgoing bubbles.
 * - `pending` — optimistic, REST in flight
 * - `sent` — REST succeeded (single tick)
 * - `read` — peer read receipt (double tick)
 * - `error` — REST send failed
 */
export type ChatMessageDeliveryStatus = "pending" | "sent" | "read" | "error";

/** Message row used in the UI (history + optimistic outbound) */
export type ChatDisplayMessage = ChatMessage & {
  /** Stable local id for an optimistic row before/after server assign */
  clientId?: string;
  deliveryStatus?: ChatMessageDeliveryStatus;
};

/** Latest-message preview on a chat list row (no `createdAt`) */
export type ChatListMessage = {
  id: string;
  senderId: string;
  message: string;
  attachments: ChatAttachment[];
};

/** Other participant on a chat list row */
export type ChatOtherUser = {
  id: string;
  name: string;
  avatar: string | null;
};

/** Per-user read watermark on a thread */
export type ChatThreadParticipant = {
  userId: string;
  lastReadAt: string | null;
};

/** One thread in GET `/chat` */
export type ChatListItem = {
  threadId: string;
  otherUser: ChatOtherUser;
  timestamp: string;
  message: ChatListMessage;
  /**
   * Authenticated user's last-read watermark (legacy / convenience).
   * Prefer `participants[].lastReadAt` when present.
   */
  lastReadAt: string | null;
  /** Per-participant read watermarks (includes current user + peer) */
  participants?: ChatThreadParticipant[];
  muted: boolean;
  archived: boolean;
};

/** Cursor pagination metadata from GET `/chat/history` */
export type ChatHistoryPagination = {
  remainingMessagesCount: number;
};

/**
 * Query params for GET `/chat/history`.
 * Provide `threadId` (preferred) or `receiverId`.
 */
export type GetChatHistoryParams = {
  threadId?: string;
  receiverId?: string;
  /** Fetch messages older than this message ID */
  beforeMessageId?: string;
};
