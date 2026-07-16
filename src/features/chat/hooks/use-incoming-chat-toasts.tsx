"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { BubbleChatIcon } from "@hugeicons/core-free-icons";
import { chatSocket } from "@/features/chat/services/chat-socket";
import { getActiveChatPeerUserId } from "@/features/chat/utils/active-chat-session";
import { buildChatPath } from "@/features/chat/utils/build-chat-path";
import { formatChatPreviewText } from "@/features/chat/utils/format-chat-display";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

const TOAST_DURATION_MS = 4000;

/**
 * App-wide listener: toast for inbound chat messages (any authenticated page).
 * Skips own echoes and messages for the conversation currently open.
 */
export function useIncomingChatToasts(): void {
  const router = useRouter();
  const { user } = useAuthSelector();

  useEffect(() => {
    const currentUserId = user?.id;
    if (!currentUserId) {
      return;
    }

    return chatSocket.on("message", (event) => {
      const { message } = event;

      if (message.senderId === currentUserId) {
        return;
      }

      if (getActiveChatPeerUserId() === message.senderId) {
        return;
      }

      const preview = formatChatPreviewText({
        id: message.id,
        senderId: message.senderId,
        message: message.message,
        attachments: message.attachments,
      });

      const href = buildChatPath({ receiverId: message.senderId });

      toast.custom(
        (toastId) => (
          <button
            type="button"
            className={cn(
              "flex w-[min(100%,22rem)] cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-lg",
              "transition-colors hover:bg-muted"
            )}
            onClick={() => {
              router.push(href);
              toast.dismiss(toastId);
            }}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HugeiconsIcon
                icon={BubbleChatIcon}
                strokeWidth={2}
                className="size-5"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">
                New message
              </span>
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {preview}
              </span>
            </span>
          </button>
        ),
        { duration: TOAST_DURATION_MS }
      );
    });
  }, [user?.id, router]);
}
