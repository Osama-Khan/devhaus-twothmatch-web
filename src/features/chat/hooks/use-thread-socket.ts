"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatSocket } from "@/features/chat/services/chat-socket";
import {
  CHAT_TYPING_EMIT_THROTTLE_MS,
  CHAT_TYPING_INDICATOR_TIMEOUT_MS,
  type ChatSocketMessageEvent,
  type ChatSocketReadEvent,
  type ChatSocketTypingEvent,
} from "@/features/chat/types/chat-socket";

type UseThreadSocketArgs = {
  threadId: string | undefined;
  /** Skip subscribe until a thread id is available */
  enabled?: boolean;
  /** Live message for this thread (dedupe by `message.id` in the consumer) */
  onMessage?: (event: ChatSocketMessageEvent) => void;
  /** Read watermark from another participant */
  onRead?: (event: ChatSocketReadEvent) => void;
};

type UseThreadSocketResult = {
  /** True after a successful `thread:subscribe` ack */
  isSubscribed: boolean;
  /** User id currently shown as typing in this thread, if any */
  typingUserId: string | null;
  /** Throttled typing emit (~2.5s). No-op until subscribed. */
  emitTyping: () => void;
  /** Emit socket `read` for this thread. No-op until subscribed. */
  markRead: () => void;
};

/**
 * Thread-scoped realtime: subscribe/unsubscribe, typing, read, and inbound events.
 * Re-sends `thread:subscribe` automatically on socket reconnect (via `chatSocket`).
 */
export function useThreadSocket({
  threadId,
  enabled = true,
  onMessage,
  onRead,
}: UseThreadSocketArgs): UseThreadSocketResult {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);

  const lastTypingEmitAt = useRef(0);
  const typingHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);
  const onReadRef = useRef(onRead);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onReadRef.current = onRead;
  }, [onRead]);

  const clearTypingTimer = useCallback(() => {
    if (typingHideTimer.current) {
      clearTimeout(typingHideTimer.current);
      typingHideTimer.current = null;
    }
  }, []);

  const showTyping = useCallback(
    (userId: string) => {
      setTypingUserId(userId);
      clearTypingTimer();
      typingHideTimer.current = setTimeout(() => {
        setTypingUserId(null);
        typingHideTimer.current = null;
      }, CHAT_TYPING_INDICATOR_TIMEOUT_MS);
    },
    [clearTypingTimer]
  );

  useEffect(() => {
    if (!enabled || !threadId) {
      setIsSubscribed(false);
      setTypingUserId(null);
      return;
    }

    let cancelled = false;

    const syncSubscribe = () => {
      void chatSocket.subscribeThread(threadId).then((ack) => {
        if (!cancelled) {
          setIsSubscribed(ack.ok);
        }
      });
    };

    syncSubscribe();

    const offConnection = chatSocket.onConnectionChange((connected) => {
      if (connected) {
        syncSubscribe();
      } else if (!cancelled) {
        setIsSubscribed(false);
      }
    });

    const offMessage = chatSocket.on("message", (event) => {
      if (event.threadId !== threadId) {
        return;
      }

      // Inbound message from a typer clears their typing indicator
      setTypingUserId((current) =>
        current === event.message.senderId ? null : current
      );
      clearTypingTimer();
      onMessageRef.current?.(event);
    });

    const offTyping = chatSocket.on("typing", (event: ChatSocketTypingEvent) => {
      if (event.threadId !== threadId) {
        return;
      }
      showTyping(event.userId);
    });

    const offRead = chatSocket.on("read", (event) => {
      if (event.threadId !== threadId) {
        return;
      }
      onReadRef.current?.(event);
    });

    return () => {
      cancelled = true;
      offConnection();
      offMessage();
      offTyping();
      offRead();
      clearTypingTimer();
      setIsSubscribed(false);
      setTypingUserId(null);
      void chatSocket.unsubscribeThread(threadId);
    };
  }, [enabled, threadId, clearTypingTimer, showTyping]);

  const emitTyping = useCallback(() => {
    if (!threadId || !isSubscribed) {
      return;
    }

    const now = Date.now();
    if (now - lastTypingEmitAt.current < CHAT_TYPING_EMIT_THROTTLE_MS) {
      return;
    }

    lastTypingEmitAt.current = now;
    chatSocket.emitTyping(threadId);
  }, [threadId, isSubscribed]);

  const markRead = useCallback(() => {
    if (!threadId || !isSubscribed) {
      return;
    }
    chatSocket.emitRead(threadId);
  }, [threadId, isSubscribed]);

  return {
    isSubscribed,
    typingUserId,
    emitTyping,
    markRead,
  };
}
