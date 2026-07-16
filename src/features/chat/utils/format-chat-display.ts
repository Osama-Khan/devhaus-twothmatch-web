import { formatDistanceToNowStrict } from "date-fns";
import type { ChatAttachment, ChatListMessage } from "@/features/chat/types";

/**
 * Compact relative timestamp for thread list rows (e.g. "1 hr ago").
 */
export function formatChatListTime(isoDate: string): string {
  return formatDistanceToNowStrict(new Date(isoDate), { addSuffix: true })
    .replace(/\bminute\b/, "min")
    .replace(/\bminutes\b/, "mins")
    .replace(/\bhour\b/, "hr")
    .replace(/\bhours\b/, "hrs");
}

/**
 * Clock time for message bubbles (e.g. "2:34 pm").
 */
export function formatMessageTime(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date(isoDate))
    .toLowerCase();
}

/** Whether a chat attachment URL looks like an image */
export function isChatImageUrl(url: string): boolean {
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(url);
}

/** Filename from an attachment URL for file chips */
export function chatAttachmentFileName(url: string): string {
  try {
    const path = new URL(url).pathname;
    const name = decodeURIComponent(path.split("/").pop() ?? "");
    return name || "Attachment";
  } catch {
    const name = url.split("/").pop()?.split("?")[0] ?? "";
    return name || "Attachment";
  }
}

/**
 * Preview text for a thread's latest message (text or attachment hint).
 */
export function formatChatPreviewText(message: ChatListMessage): string {
  const hasAttachments = message.attachments.length > 0;
  const text = message.message.trim();

  if (hasAttachments && (!text || text === "Uploaded")) {
    const count = message.attachments.length;
    return count === 1 ? "Attachment" : `${count} attachments`;
  }

  if (hasAttachments && text) {
    return text;
  }

  return text || "No messages yet";
}

/** Count image vs file attachments for layout hints */
export function splitChatAttachments(attachments: ChatAttachment[]): {
  images: ChatAttachment[];
  files: ChatAttachment[];
} {
  const images: ChatAttachment[] = [];
  const files: ChatAttachment[] = [];

  for (const attachment of attachments) {
    if (isChatImageUrl(attachment.url)) {
      images.push(attachment);
    } else {
      files.push(attachment);
    }
  }

  return { images, files };
}
