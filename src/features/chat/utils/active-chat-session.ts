/**
 * Tracks which peer the user is currently viewing in the chat pane.
 * Used to suppress inbound message toasts for the open conversation.
 */
let activePeerUserId: string | null = null;

/** Set when a chat (thread or draft) is open; clear on unmount / back. */
export function setActiveChatPeerUserId(userId: string | null): void {
  activePeerUserId = userId;
}

/** Peer user id for the open conversation, if any */
export function getActiveChatPeerUserId(): string | null {
  return activePeerUserId;
}
