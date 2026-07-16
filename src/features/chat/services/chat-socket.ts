"use client";

import { io, type Socket } from "socket.io-client";
import {
  ChatSocketClientEvents,
  type ChatSocketAck,
  type ChatSocketMessageEvent,
  type ChatSocketPresenceEvent,
  type ChatSocketReadEvent,
  type ChatSocketServerHandlers,
  type ChatSocketTypingEvent,
  type PresenceSubscribeAck,
  type PresenceSubscribePayload,
  type PresenceUnsubscribePayload,
  type ReadEmitPayload,
  type ThreadSubscribePayload,
  type ThreadUnsubscribePayload,
  type TypingEmitPayload,
} from "@/features/chat/types/chat-socket";
import { getAccessToken } from "@/lib/services/token-storage";
import { appEnv } from "@/lib/utils/env";
import { logger } from "@/lib/utils/logger";

const socketLogger = logger.child("ChatSocket");

type ConnectionListener = (connected: boolean) => void;

/** Server → client events (Socket.IO typed client) */
type ServerToClientEvents = {
  message: (payload: ChatSocketMessageEvent) => void;
  typing: (payload: ChatSocketTypingEvent) => void;
  read: (payload: ChatSocketReadEvent) => void;
  presence: (payload: ChatSocketPresenceEvent) => void;
};

/** Client → server events (Socket.IO typed client) */
type ClientToServerEvents = {
  "thread:subscribe": (
    payload: ThreadSubscribePayload,
    ack?: (response: ChatSocketAck) => void
  ) => void;
  "thread:unsubscribe": (
    payload: ThreadUnsubscribePayload,
    ack?: (response: ChatSocketAck) => void
  ) => void;
  typing: (payload: TypingEmitPayload) => void;
  read: (payload: ReadEmitPayload) => void;
  "presence:subscribe": (
    payload: PresenceSubscribePayload,
    ack?: (response: PresenceSubscribeAck) => void
  ) => void;
  "presence:unsubscribe": (
    payload: PresenceUnsubscribePayload,
    ack?: (response: ChatSocketAck) => void
  ) => void;
};

type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

type PendingHandler = {
  event: keyof ServerToClientEvents;
  handler: ServerToClientEvents[keyof ServerToClientEvents];
};

/**
 * Singleton Socket.IO client for chat realtime.
 *
 * - One connection per app session (`auth.token` = JWT).
 * - Server auto-joins `user:{userId}` on connect.
 * - Thread / presence rooms reset on reconnect — tracked subscriptions are
 *   re-emitted in the `connect` handler.
 */
class ChatSocketManager {
  private socket: ChatSocket | null = null;
  private token: string | null = null;
  private readonly threadIds = new Set<string>();
  private readonly presenceUserIds = new Set<string>();
  private readonly connectionListeners = new Set<ConnectionListener>();
  private pendingHandlers: PendingHandler[] = [];

  /** Whether the socket is currently connected */
  isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }

  /**
   * Open (or replace) the session socket with the given JWT.
   * No-ops when already using the same token (reconnects if needed).
   */
  connect(token?: string | null): void {
    const nextToken = token ?? getAccessToken();
    if (!nextToken) {
      socketLogger.warn("connect skipped — no auth token");
      return;
    }

    if (this.socket && this.token === nextToken) {
      if (!this.socket.connected) {
        this.socket.connect();
      }
      return;
    }

    this.teardownSocket();
    this.token = nextToken;

    this.socket = io(appEnv.apiUrl.replace(/\/$/, ""), {
      auth: { token: nextToken },
      transports: ["websocket"],
      autoConnect: true,
    });

    this.attachPendingHandlers(this.socket);

    this.socket.on("connect", () => {
      socketLogger.info("connected", { id: this.socket?.id });
      this.resubscribeRooms();
      this.notifyConnection(true);
    });

    this.socket.on("disconnect", (reason) => {
      socketLogger.info("disconnected", { reason });
      this.notifyConnection(false);
    });

    this.socket.on("connect_error", (error) => {
      socketLogger.warn("connect_error", { message: error.message });
    });
  }

  /**
   * Tear down the socket and clear tracked subscriptions (logout / session end).
   */
  disconnect(): void {
    this.teardownSocket();
    this.token = null;
    this.threadIds.clear();
    this.presenceUserIds.clear();
    this.notifyConnection(false);
  }

  /**
   * Subscribe to connection status changes. Returns an unsubscribe function.
   * Invokes immediately with the current status.
   */
  onConnectionChange(listener: ConnectionListener): () => void {
    this.connectionListeners.add(listener);
    listener(this.isConnected());
    return () => {
      this.connectionListeners.delete(listener);
    };
  }

  /**
   * Listen for a server → client event. Survives socket reconnects within the
   * same manager session. Returns an unsubscribe function.
   */
  on<E extends keyof ChatSocketServerHandlers>(
    event: E,
    handler: ChatSocketServerHandlers[E]
  ): () => void {
    const entry = { event, handler } as PendingHandler;
    this.pendingHandlers.push(entry);

    type BindListener = (
      event: E,
      handler: ChatSocketServerHandlers[E]
    ) => void;

    if (this.socket) {
      (this.socket.on as BindListener)(event, handler);
    }

    return () => {
      this.pendingHandlers = this.pendingHandlers.filter(
        (item) => item !== entry
      );
      // Socket may already be torn down (logout / Strict Mode remount).
      // Do not use `socket?.off` with a cast — that can invoke `undefined`.
      if (this.socket) {
        (this.socket.off as BindListener)(event, handler);
      }
    };
  }

  /** Authorize typing/read for a thread; re-subscribed automatically on reconnect. */
  subscribeThread(threadId: string): Promise<ChatSocketAck> {
    this.threadIds.add(threadId);
    return this.emitWithAck(ChatSocketClientEvents.threadSubscribe, {
      threadId,
    });
  }

  /** Leave thread typing/read authorization. */
  unsubscribeThread(threadId: string): Promise<ChatSocketAck> {
    this.threadIds.delete(threadId);
    return this.emitWithAck(ChatSocketClientEvents.threadUnsubscribe, {
      threadId,
    });
  }

  /** Emit typing for a subscribed thread (caller should throttle ~2–3s). */
  emitTyping(threadId: string): void {
    if (!this.socket?.connected) {
      socketLogger.warn("emit skipped — socket not connected", {
        event: ChatSocketClientEvents.typing,
      });
      return;
    }
    this.socket.emit(ChatSocketClientEvents.typing, { threadId });
  }

  /** Mark thread read (same effect as REST mark-read). */
  emitRead(threadId: string): void {
    if (!this.socket?.connected) {
      socketLogger.warn("emit skipped — socket not connected", {
        event: ChatSocketClientEvents.read,
      });
      return;
    }
    this.socket.emit(ChatSocketClientEvents.read, { threadId });
  }

  /**
   * Subscribe to presence for the given users.
   * Ack includes an initial snapshot. Re-subscribed on reconnect.
   */
  subscribePresence(userIds: string[]): Promise<PresenceSubscribeAck> {
    for (const userId of userIds) {
      this.presenceUserIds.add(userId);
    }

    return this.emitWithAck(ChatSocketClientEvents.presenceSubscribe, {
      userIds: [...new Set(userIds)],
    });
  }

  /** Stop receiving presence for the given users. */
  unsubscribePresence(userIds: string[]): Promise<ChatSocketAck> {
    for (const userId of userIds) {
      this.presenceUserIds.delete(userId);
    }

    return this.emitWithAck(ChatSocketClientEvents.presenceUnsubscribe, {
      userIds: [...new Set(userIds)],
    });
  }

  private teardownSocket(): void {
    if (!this.socket) {
      return;
    }

    this.socket.removeAllListeners();
    this.socket.disconnect();
    this.socket = null;
  }

  private attachPendingHandlers(socket: ChatSocket): void {
    for (const { event, handler } of this.pendingHandlers) {
      socket.on(event, handler);
    }
  }

  private notifyConnection(connected: boolean): void {
    for (const listener of this.connectionListeners) {
      listener(connected);
    }
  }

  /** Rooms reset after reconnect — re-send tracked thread + presence subscriptions. */
  private resubscribeRooms(): void {
    if (!this.socket?.connected) {
      return;
    }

    for (const threadId of this.threadIds) {
      this.socket.emit(ChatSocketClientEvents.threadSubscribe, { threadId });
    }

    if (this.presenceUserIds.size > 0) {
      this.socket.emit(ChatSocketClientEvents.presenceSubscribe, {
        userIds: [...this.presenceUserIds],
      });
    }
  }

  private emitWithAck(
    event: typeof ChatSocketClientEvents.presenceSubscribe,
    payload: PresenceSubscribePayload
  ): Promise<PresenceSubscribeAck>;
  private emitWithAck(
    event:
      | typeof ChatSocketClientEvents.threadSubscribe
      | typeof ChatSocketClientEvents.threadUnsubscribe
      | typeof ChatSocketClientEvents.presenceUnsubscribe,
    payload:
      | ThreadSubscribePayload
      | ThreadUnsubscribePayload
      | PresenceUnsubscribePayload
  ): Promise<ChatSocketAck>;
  private emitWithAck(
    event: string,
    payload: object
  ): Promise<ChatSocketAck | PresenceSubscribeAck> {
    return new Promise((resolve) => {
      if (!this.socket?.connected) {
        socketLogger.warn("emitWithAck skipped — socket not connected", {
          event,
        });
        resolve({ ok: false, code: "NOT_CONNECTED" });
        return;
      }

      this.socket.emit(
        event as keyof ClientToServerEvents,
        payload as never,
        (ack: ChatSocketAck | PresenceSubscribeAck) => {
          resolve(ack);
        }
      );
    });
  }
}

/** App-wide chat Socket.IO manager (one socket per session) */
export const chatSocket = new ChatSocketManager();
