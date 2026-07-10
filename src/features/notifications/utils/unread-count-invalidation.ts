type UnreadCountListener = () => void;

const listeners = new Set<UnreadCountListener>();

/**
 * Subscribe to unread-count invalidation events (e.g. after mark-as-read).
 * Returns an unsubscribe function.
 */
export function subscribeUnreadCountInvalidation(
  listener: UnreadCountListener
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Notify subscribers that the unread count may have changed and should be refetched.
 */
export function invalidateUnreadCount(): void {
  for (const listener of listeners) {
    listener();
  }
}
