"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelCircleIcon,
  CheckIcon,
  File01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import type {
  ChatAttachment,
  ChatDisplayMessage,
  ChatMessageDeliveryStatus,
} from "@/features/chat/types";
import {
  chatAttachmentFileName,
  formatMessageTime,
  splitChatAttachments,
} from "@/features/chat/utils/format-chat-display";
import { cn } from "@/lib/utils";

type ChatMessageBubbleProps = {
  message: ChatDisplayMessage;
  isOwn: boolean;
};

function AttachmentImages({
  images,
  isOwn,
}: {
  images: ChatAttachment[];
  isOwn: boolean;
}) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-1.5",
        images.length > 1 ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {images.map((attachment) => (
        <a
          key={attachment.id}
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- remote chat URLs vary by host */}
          <img
            src={attachment.url}
            alt={chatAttachmentFileName(attachment.url)}
            className={cn(
              "max-h-56 w-full object-cover",
              isOwn ? "bg-primary/20" : "bg-muted"
            )}
          />
        </a>
      ))}
    </div>
  );
}

function AttachmentFiles({
  files,
  isOwn,
}: {
  files: ChatAttachment[];
  isOwn: boolean;
}) {
  if (files.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {files.map((attachment) => {
        const name = chatAttachmentFileName(attachment.url);

        return (
          <a
            key={attachment.id}
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors",
              isOwn
                ? "bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25"
                : "bg-background text-foreground hover:bg-muted"
            )}
          >
            <HugeiconsIcon
              icon={File01Icon}
              strokeWidth={2}
              className="size-4 shrink-0"
            />
            <span className="min-w-0 truncate font-medium underline-offset-2 hover:underline">
              {name}
            </span>
          </a>
        );
      })}
    </div>
  );
}

function DeliveryStatusIcon({
  status,
  isOwn,
}: {
  status: ChatMessageDeliveryStatus;
  isOwn: boolean;
}) {
  if (status === "pending") {
    return (
      <HugeiconsIcon
        icon={Loading03Icon}
        strokeWidth={2}
        className={cn(
          "size-3 shrink-0 animate-spin",
          isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
        )}
        aria-label="Sending"
      />
    );
  }

  if (status === "error") {
    return (
      <HugeiconsIcon
        icon={CancelCircleIcon}
        strokeWidth={2}
        className="size-3.5 shrink-0 text-destructive"
        aria-label="Failed to send"
      />
    );
  }

  return (
    <HugeiconsIcon
      icon={CheckIcon}
      strokeWidth={2.5}
      className={cn(
        "size-3.5 shrink-0",
        isOwn ? "text-primary-foreground/80" : "text-muted-foreground"
      )}
      aria-label="Sent"
    />
  );
}

/**
 * Messenger-style message bubble with optional image/file attachments.
 */
export function ChatMessageBubble({ message, isOwn }: ChatMessageBubbleProps) {
  const { images, files } = splitChatAttachments(message.attachments);
  const hasAttachments = images.length > 0 || files.length > 0;
  const text = message.message.trim();
  const showText = Boolean(text) && !(hasAttachments && text === "Uploaded");
  const deliveryStatus = isOwn
    ? (message.deliveryStatus ?? "sent")
    : undefined;

  return (
    <div
      className={cn("flex w-full", isOwn ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex max-w-[min(85%,28rem)] flex-col gap-1.5 rounded-2xl px-3.5 py-2.5 shadow-sm",
          isOwn
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-card text-foreground ring-1 ring-border",
          deliveryStatus === "pending" && "opacity-90",
          deliveryStatus === "error" && "ring-2 ring-destructive/50"
        )}
      >
        {hasAttachments ? (
          <div className="flex flex-col gap-1.5">
            <AttachmentImages images={images} isOwn={isOwn} />
            <AttachmentFiles files={files} isOwn={isOwn} />
          </div>
        ) : null}

        {showText ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {text}
          </p>
        ) : null}

        <div
          className={cn(
            "flex items-center gap-1 self-end",
            isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          <time
            dateTime={message.createdAt}
            className="text-[10px] leading-none"
          >
            {formatMessageTime(message.createdAt)}
          </time>
          {deliveryStatus ? (
            <DeliveryStatusIcon status={deliveryStatus} isOwn={isOwn} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
