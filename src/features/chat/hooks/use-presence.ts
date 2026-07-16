"use client";

import { useEffect, useState } from "react";
import { chatSocket } from "@/features/chat/services/chat-socket";
import type {
  ChatPresenceSnapshot,
  ChatPresenceState,
} from "@/features/chat/types/chat-socket";

type UsePresenceArgs = {
  /** User ids to watch (e.g. other participants on the threads list) */
  userIds: string[];
  enabled?: boolean;
};

type UsePresenceResult = {
  /** Latest presence keyed by user id (snapshot + live updates) */
  presenceByUserId: ChatPresenceSnapshot;
  /** True after the first successful `presence:subscribe` ack */
  isReady: boolean;
  /** Convenience lookup */
  getPresence: (userId: string) => ChatPresenceState | undefined;
};

function toStableUserIds(userIds: string[]): string[] {
  const unique = [...new Set(userIds.filter(Boolean))];
  unique.sort();
  return unique;
}

/**
 * Subscribes to online/last-seen for the given users.
 * Applies the subscribe ack snapshot, then merges live `presence` events.
 */
export function usePresence({
  userIds,
  enabled = true,
}: UsePresenceArgs): UsePresenceResult {
  const [presenceByUserId, setPresenceByUserId] = useState<ChatPresenceSnapshot>(
    {}
  );
  const [isReady, setIsReady] = useState(false);

  const userIdsKey = toStableUserIds(userIds).join(",");

  useEffect(() => {
    const stableUserIds = userIdsKey.length > 0 ? userIdsKey.split(",") : [];

    if (!enabled || stableUserIds.length === 0) {
      setPresenceByUserId({});
      setIsReady(false);
      return;
    }

    let cancelled = false;

    const syncSubscribe = () => {
      void chatSocket.subscribePresence(stableUserIds).then((ack) => {
        if (cancelled) {
          return;
        }

        if (ack.ok) {
          setPresenceByUserId(ack.snapshot ?? {});
          setIsReady(true);
        } else {
          setIsReady(false);
        }
      });
    };

    const offConnection = chatSocket.onConnectionChange((connected) => {
      if (connected) {
        syncSubscribe();
      } else if (!cancelled) {
        setIsReady(false);
      }
    });

    const offPresence = chatSocket.on("presence", (event) => {
      if (!stableUserIds.includes(event.userId)) {
        return;
      }

      setPresenceByUserId((current) => ({
        ...current,
        [event.userId]: {
          online: event.online,
          lastSeen: event.lastSeen,
        },
      }));
    });

    syncSubscribe();

    return () => {
      cancelled = true;
      offConnection();
      offPresence();
      setIsReady(false);
      void chatSocket.unsubscribePresence(stableUserIds);
    };
  }, [enabled, userIdsKey]);

  return {
    presenceByUserId,
    isReady,
    getPresence: (userId: string) => presenceByUserId[userId],
  };
}
