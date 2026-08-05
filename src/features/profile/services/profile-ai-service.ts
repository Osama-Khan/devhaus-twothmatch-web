"use client";

import { apiPath, externalApiRoutes } from "@/lib/routes";
import { getAccessToken } from "@/lib/services/token-storage";
import {
  consumeSseResponse,
  readErrorMessage,
} from "@/lib/sse/stream-sse";
import { appEnv } from "@/lib/utils/env";
import { logger } from "@/lib/utils/logger";

const aiLogger = logger.child("ProfileAiService");

/** Callbacks for SSE from profile about AI endpoints */
export type AboutStreamHandlers = {
  onDelta: (text: string) => void;
  /** Final about text (practice `about` or candidate `aboutMe`) */
  onDone: (aboutText: string) => void;
  onError: (message: string) => void;
};

type StreamOptions = {
  signal?: AbortSignal;
};

async function postProfileAboutStream(
  path: string,
  body: unknown,
  handlers: AboutStreamHandlers,
  options: StreamOptions,
  label: string,
  doneKey: "about" | "aboutMe"
): Promise<void> {
  const token = getAccessToken();
  const url = `${appEnv.apiUrl.replace(/\/$/, "")}${apiPath(path)}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal: options.signal,
    });
  } catch (error) {
    if (options.signal?.aborted) {
      return;
    }
    const message =
      error instanceof Error ? error.message : `Failed to ${label}`;
    aiLogger.error(`${label} request failed`, { message });
    handlers.onError(message);
    return;
  }

  if (!response.ok) {
    const message = await readErrorMessage(response);
    aiLogger.warn(`${label} rejected`, { status: response.status, message });
    handlers.onError(message);
    return;
  }

  await consumeSseResponse(
    response,
    {
      onDelta: handlers.onDelta,
      onDone: (payload) => {
        const text = payload[doneKey] ?? payload.about ?? payload.aboutMe;
        if (typeof text === "string") {
          handlers.onDone(text);
        } else {
          handlers.onError(`${label} ended without about text`);
        }
      },
      onError: handlers.onError,
    },
    { signal: options.signal, label }
  );
}

/**
 * Generate practice/candidate about text from saved profile via SSE.
 * Sends an empty body — the server seeds from the authenticated profile.
 * Does not persist — client must PUT `/profile` with the result.
 */
export async function generateAboutStream(
  handlers: AboutStreamHandlers,
  options: StreamOptions = {}
): Promise<void> {
  return postProfileAboutStream(
    externalApiRoutes.ai.profile.generateAbout._self.path,
    {},
    handlers,
    options,
    "Generate about",
    "about"
  );
}

/**
 * Refine practice about text via SSE (50–2000 chars).
 * Practice body uses `{ about }`; candidate uses `{ aboutMe }`.
 */
export async function refineAboutStream(
  about: string,
  handlers: AboutStreamHandlers,
  options: StreamOptions & { kind?: "practice" | "candidate" } = {}
): Promise<void> {
  const kind = options.kind ?? "practice";
  const body =
    kind === "candidate" ? { aboutMe: about } : { about };

  return postProfileAboutStream(
    externalApiRoutes.ai.profile.refineAbout._self.path,
    body,
    handlers,
    options,
    "Refine about",
    kind === "candidate" ? "aboutMe" : "about"
  );
}
