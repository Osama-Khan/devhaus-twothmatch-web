"use client";

import { useId, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUp01Icon,
  Attachment01Icon,
  Cancel01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_SEND_FILE_MAX_BYTES,
  CHAT_SEND_FILE_MAX_COUNT,
} from "@/features/chat/types";
import { cn } from "@/lib/utils";

type ChatComposerProps = {
  disabled?: boolean;
  /** Throttled typing emit while the user is composing */
  onTyping?: () => void;
  onSend: (payload: {
    message: string;
    files: File[];
  }) => Promise<void> | void;
};

/**
 * Text + optional file attachments composer for an open chat thread.
 * Clears immediately on send; delivery status lives on the message bubble.
 */
export function ChatComposer({
  disabled = false,
  onTyping,
  onSend,
}: ChatComposerProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const canSend =
    !disabled && (text.trim().length > 0 || files.length > 0);

  function addFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) {
      return;
    }

    setLocalError(null);

    const next = [...files];
    for (const file of Array.from(incoming)) {
      if (next.length >= CHAT_SEND_FILE_MAX_COUNT) {
        setLocalError(`You can attach up to ${CHAT_SEND_FILE_MAX_COUNT} files.`);
        break;
      }
      if (file.size > CHAT_SEND_FILE_MAX_BYTES) {
        setLocalError(`"${file.name}" exceeds the 50MB limit.`);
        continue;
      }
      next.push(file);
    }

    setFiles(next);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    if (!canSend) {
      return;
    }

    const message = text.trim();
    const pendingFiles = files;

    setLocalError(null);
    setText("");
    setFiles([]);

    void onSend({ message, files: pendingFiles });
  }

  return (
    <div className="border-t border-border bg-card px-3 py-3 sm:px-4">
      {files.length > 0 ? (
        <ul className="mb-2 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="flex max-w-full items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
            >
              <HugeiconsIcon
                icon={File01Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0 text-muted-foreground"
              />
              <span className="min-w-0 truncate">{file.name}</span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                className="rounded-full p-0.5 text-muted-foreground hover:bg-background hover:text-foreground"
                onClick={() => removeFile(index)}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {localError ? (
        <p className="mb-2 text-xs text-destructive">{localError}</p>
      ) : null}

      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(event) => addFiles(event.target.files)}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          disabled={disabled}
          aria-label="Attach files"
          onClick={() => fileInputRef.current?.click()}
        >
          <HugeiconsIcon icon={Attachment01Icon} strokeWidth={2} />
        </Button>

        <Textarea
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (event.target.value.trim().length > 0) {
              onTyping?.();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Type a message…"
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          disabled={disabled}
          rows={1}
          className={cn(
            "min-h-11 max-h-32 flex-1 rounded-2xl py-2.5",
            "field-sizing-content"
          )}
        />

        <Button
          type="button"
          size="icon"
          className="shrink-0"
          disabled={!canSend}
          aria-label="Send message"
          onClick={handleSubmit}
        >
          <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
