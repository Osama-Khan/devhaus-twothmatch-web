"use client";

import { apiPath, externalApiRoutes } from "@/lib/routes";
import { getAccessToken } from "@/lib/services/token-storage";
import { appEnv } from "@/lib/utils/env";
import { logger } from "@/lib/utils/logger";

const aiLogger = logger.child("JobsAiService");

/** Callbacks for Server-Sent Events from POST `/ai/jobs/refine-jd` */
export type RefineJdStreamHandlers = {
  /** Incremental text chunk from `event: delta` */
  onDelta: (text: string) => void;
  /** Final refined description from `event: done` */
  onDone: (jobDescription: string) => void;
  /** Stream or pre-stream error */
  onError: (message: string) => void;
};

type RefineJdStreamOptions = {
  signal?: AbortSignal;
};

type SseEvent = {
  event: string;
  data: string;
};

/**
 * Parse a chunk of SSE text into discrete `event` / `data` pairs.
 * Accumulates incomplete trailing lines via `buffer`.
 */
function consumeSseBuffer(buffer: string): { events: SseEvent[]; rest: string } {
  const normalized = buffer.replace(/\r\n/g, "\n");
  const parts = normalized.split("\n\n");
  const rest = parts.pop() ?? "";
  const events: SseEvent[] = [];

  for (const part of parts) {
    if (!part.trim()) continue;

    let event = "message";
    const dataLines: string[] = [];

    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice("event:".length).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice("data:".length).trimStart());
      }
    }

    if (dataLines.length > 0) {
      events.push({ event, data: dataLines.join("\n") });
    }
  }

  return { events, rest };
}

function parseJsonRecord(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Stream-refine a permanent job description draft via SSE.
 *
 * Emits `delta` chunks, then a final `done` payload with `jobDescription`.
 * Draft must be 100–1000 characters (enforced by the API).
 */
export async function refineJobDescriptionStream(
  jobDescription: string,
  handlers: RefineJdStreamHandlers,
  options: RefineJdStreamOptions = {}
): Promise<void> {
  const token = getAccessToken();
  const url = `${appEnv.apiUrl.replace(/\/$/, "")}${apiPath(
    externalApiRoutes.ai.jobs.refineJd._self.path
  )}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ jobDescription }),
      signal: options.signal,
    });
  } catch (error) {
    if (options.signal?.aborted) {
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to refine job description";
    aiLogger.error("Refine JD request failed", { message });
    handlers.onError(message);
    return;
  }

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const json = (await response.json()) as { message?: string };
      if (json.message) {
        message = json.message;
      }
    } catch {
      // keep status fallback
    }
    aiLogger.warn("Refine JD rejected", { status: response.status, message });
    handlers.onError(message);
    return;
  }

  if (!response.body) {
    handlers.onError("No response stream from refine endpoint");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let receivedDone = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const { events, rest } = consumeSseBuffer(buffer);
      buffer = rest;

      for (const sse of events) {
        const payload = parseJsonRecord(sse.data);

        if (sse.event === "delta") {
          const text = payload?.text;
          if (typeof text === "string" && text.length > 0) {
            handlers.onDelta(text);
          }
          continue;
        }

        if (sse.event === "done") {
          const finalDescription = payload?.jobDescription;
          if (typeof finalDescription === "string") {
            receivedDone = true;
            handlers.onDone(finalDescription);
          } else {
            handlers.onError("Refine stream ended without a job description");
          }
          return;
        }

        if (sse.event === "error") {
          const message =
            typeof payload?.message === "string"
              ? payload.message
              : "Failed to refine job description";
          handlers.onError(message);
          return;
        }
      }
    }

    if (!receivedDone && !options.signal?.aborted) {
      handlers.onError("Refine stream ended unexpectedly");
    }
  } catch (error) {
    if (options.signal?.aborted) {
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to read refine stream";
    aiLogger.error("Refine JD stream failed", { message });
    handlers.onError(message);
  } finally {
    reader.releaseLock();
  }
}
