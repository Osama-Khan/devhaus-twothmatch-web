/**
 * Shared Server-Sent Events helpers for AI streaming endpoints
 * (`delta` / `done` / `error` event shape).
 */

export type SseEvent = {
  event: string;
  data: string;
};

export type StreamSseHandlers = {
  onDelta: (text: string) => void;
  onDone: (payload: Record<string, unknown>) => void;
  onError: (message: string) => void;
};

export type StreamSseOptions = {
  signal?: AbortSignal;
  /** Logger label for errors */
  label?: string;
};

/**
 * Parse a chunk of SSE text into discrete `event` / `data` pairs.
 * Accumulates incomplete trailing lines via `buffer`.
 */
export function consumeSseBuffer(buffer: string): {
  events: SseEvent[];
  rest: string;
} {
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

/** Parse a JSON object from an SSE data payload. */
export function parseJsonRecord(raw: string): Record<string, unknown> | null {
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
 * Consume a fetch `Response` body as SSE, invoking handlers for delta/done/error.
 */
export async function consumeSseResponse(
  response: Response,
  handlers: StreamSseHandlers,
  options: StreamSseOptions = {}
): Promise<void> {
  if (!response.body) {
    handlers.onError("No response stream from endpoint");
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
          receivedDone = true;
          handlers.onDone(payload ?? {});
          return;
        }

        if (sse.event === "error") {
          const message =
            typeof payload?.message === "string"
              ? payload.message
              : "Stream failed";
          handlers.onError(message);
          return;
        }
      }
    }

    if (!receivedDone && !options.signal?.aborted) {
      handlers.onError("Stream ended unexpectedly");
    }
  } catch (error) {
    if (options.signal?.aborted) {
      return;
    }
    const message =
      error instanceof Error ? error.message : "Failed to read stream";
    handlers.onError(message);
  } finally {
    reader.releaseLock();
  }
}

/** Extract an error message from a non-OK JSON response body. */
export async function readErrorMessage(
  response: Response,
  fallback?: string
): Promise<string> {
  try {
    const json = (await response.json()) as { message?: string };
    if (json.message) {
      return json.message;
    }
  } catch {
    // keep fallback
  }
  return fallback ?? `Request failed with status ${response.status}`;
}
