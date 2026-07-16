"use client";

import { useEffect, useState } from "react";
import { chatSocket } from "@/features/chat/services/chat-socket";
import { useAuthSelector } from "@/lib/store/hooks";

type UseChatSocketConnectionResult = {
  /** True when the Socket.IO client reports connected */
  isConnected: boolean;
};

/**
 * Keeps a single chat Socket.IO session open while the user is authenticated.
 * Mount once in the authenticated app shell (e.g. via `ChatSocketConnector`).
 */
export function useChatSocketConnection(): UseChatSocketConnectionResult {
  const { token, isAuthenticated } = useAuthSelector();
  const [isConnected, setIsConnected] = useState(() => chatSocket.isConnected());

  useEffect(() => {
    return chatSocket.onConnectionChange(setIsConnected);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      chatSocket.disconnect();
      return;
    }

    chatSocket.connect(token);

    return () => {
      chatSocket.disconnect();
    };
  }, [isAuthenticated, token]);

  return { isConnected };
}
