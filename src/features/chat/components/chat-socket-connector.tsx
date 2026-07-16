"use client";

import { useChatSocketConnection } from "@/features/chat/hooks/use-chat-socket-connection";
import { useIncomingChatToasts } from "@/features/chat/hooks/use-incoming-chat-toasts";

/**
 * Session-level chat Socket.IO lifecycle + inbound message toasts.
 * Mount once under the authenticated app shell (`(main)/layout`).
 */
export function ChatSocketConnector() {
  useChatSocketConnection();
  useIncomingChatToasts();
  return null;
}
