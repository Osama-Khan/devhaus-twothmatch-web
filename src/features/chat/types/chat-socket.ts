import type { ChatMessage } from "@/features/chat/types/chat";

/** Throttle client → server `typing` emits (~2–3s) */
export const CHAT_TYPING_EMIT_THROTTLE_MS = 2500;

/**
 * Hide a remote typing indicator after this idle window with no new `typing` event.
 * Server does not emit a stop event — clients infer it.
 */
export const CHAT_TYPING_INDICATOR_TIMEOUT_MS = 4000;

/** Client → server event names */
export const ChatSocketClientEvents = {
  threadSubscribe: "thread:subscribe",
  threadUnsubscribe: "thread:unsubscribe",
  typing: "typing",
  read: "read",
  presenceSubscribe: "presence:subscribe",
  presenceUnsubscribe: "presence:unsubscribe",
} as const;

/** Server → client event names */
export const ChatSocketServerEvents = {
  message: "message",
  typing: "typing",
  read: "read",
  presence: "presence",
} as const;

export type ChatSocketClientEvent =
  (typeof ChatSocketClientEvents)[keyof typeof ChatSocketClientEvents];

export type ChatSocketServerEvent =
  (typeof ChatSocketServerEvents)[keyof typeof ChatSocketServerEvents];

/** Live message delivered after REST send / send-file */
export type ChatSocketMessageEvent = {
  threadId: string;
  message: ChatMessage & { receiverId: string };
};

/** Remote user is typing in a thread */
export type ChatSocketTypingEvent = {
  threadId: string;
  userId: string;
};

/** Read watermark for a thread participant */
export type ChatSocketReadEvent = {
  threadId: string;
  userId: string;
  lastReadAt: string;
};

/** Online / last-seen transition for a subscribed user */
export type ChatSocketPresenceEvent = {
  userId: string;
  online: boolean;
  lastSeen: string | null;
};

/** Presence row for one user */
export type ChatPresenceState = {
  online: boolean;
  lastSeen: string | null;
};

/** Snapshot keyed by user id from `presence:subscribe` ack */
export type ChatPresenceSnapshot = Record<string, ChatPresenceState>;

export type ThreadSubscribePayload = { threadId: string };
export type ThreadUnsubscribePayload = { threadId: string };
export type TypingEmitPayload = { threadId: string };
export type ReadEmitPayload = { threadId: string };
export type PresenceSubscribePayload = { userIds: string[] };
export type PresenceUnsubscribePayload = { userIds: string[] };

/** Ack for `thread:subscribe` / `thread:unsubscribe` */
export type ChatSocketOkAck = {
  ok: true;
};

export type ChatSocketErrorAck = {
  ok: false;
  code?: string;
};

export type ChatSocketAck = ChatSocketOkAck | ChatSocketErrorAck;

/** Ack for `presence:subscribe` */
export type PresenceSubscribeAck =
  | {
      ok: true;
      snapshot: ChatPresenceSnapshot;
    }
  | ChatSocketErrorAck;

/** Typed server → client handlers */
export type ChatSocketServerHandlers = {
  message: (payload: ChatSocketMessageEvent) => void;
  typing: (payload: ChatSocketTypingEvent) => void;
  read: (payload: ChatSocketReadEvent) => void;
  presence: (payload: ChatSocketPresenceEvent) => void;
};
