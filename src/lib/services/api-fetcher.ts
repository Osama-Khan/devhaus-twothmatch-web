"use client";

import { apiPath } from "@/lib/routes";
import { appEnv } from "@/lib/utils/env";
import { logger } from "@/lib/utils/logger";
import type { AppErrorDetails, AppResponseType } from "@/lib/types/response";
import { getAccessToken } from "@/lib/services/token-storage";

const apiLogger = logger.child("ApiFetcher");

let unauthorizedHandler: (() => void) | null = null;
let paymentRequiredHandler: ((payload: { message: string }) => void) | null =
  null;

/** Registers a callback invoked when an authenticated request receives 401. */
export function registerUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

/**
 * Registers a callback invoked when an authenticated request receives 402
 * (payment / subscription required).
 */
export function registerPaymentRequiredHandler(
  handler: ((payload: { message: string }) => void) | null
): void {
  paymentRequiredHandler = handler;
}

function notifyUnauthorized(skipAuth: boolean, status: number): void {
  if (!skipAuth && status === 401) {
    unauthorizedHandler?.();
  }
}

function notifyPaymentRequired(
  skipAuth: boolean,
  status: number,
  message: string
): void {
  if (!skipAuth && status === 402) {
    paymentRequiredHandler?.({ message });
  }
}

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Skip attaching Authorization header */
  skipAuth?: boolean;
};

type ApiFetcherConfig = {
  baseUrl?: string;
};

type ApiErrorBody = {
  message?: string;
  error?: string;
  success?: boolean;
};

/**
 * Typed client-side fetch wrapper for the external backend API.
 * Attaches JWT Bearer token from localStorage on authenticated requests.
 *
 * The backend returns flat JSON on success (e.g. `{ token, user }`) and
 * `{ message }` on error. Some list endpoints wrap payloads in `{ success, data }`.
 */
export class ApiFetcher {
  private baseUrl: string;

  constructor(config: ApiFetcherConfig = {}) {
    this.baseUrl = (config.baseUrl ?? appEnv.apiUrl).replace(/\/$/, "");
  }

  /** Perform a typed fetch against the external API */
  async fetch<T>(
    path: string,
    options: FetchOptions = {}
  ): Promise<AppResponseType<T>> {
    const { body, skipAuth = false, headers: customHeaders, ...rest } = options;

    const headers = new Headers(customHeaders);

    if (body !== undefined && !(body instanceof FormData) && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (!skipAuth) {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const url = `${this.baseUrl}${apiPath(path)}`;

    const requestBody =
      body === undefined
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body);

    try {
      const response = await fetch(url, {
        ...rest,
        headers,
        body: requestBody,
      });

      const json = (await response.json().catch(() => null)) as
        | T
        | ApiErrorBody
        | { success: true; data: T }
        | null;

      if (!response.ok) {
        const message = extractErrorMessage(json, response.status);
        const details = extractErrorDetails(json);
        apiLogger.warn("API error", { path, status: response.status, message });
        notifyUnauthorized(skipAuth, response.status);
        notifyPaymentRequired(skipAuth, response.status, message);
        return details
          ? { error: message, status: response.status, details }
          : { error: message, status: response.status };
      }

      if (json && typeof json === "object" && "success" in json) {
        if (json.success === false) {
          const message = extractErrorMessage(json, response.status);
          const details = extractErrorDetails(json);
          notifyUnauthorized(skipAuth, response.status);
          notifyPaymentRequired(skipAuth, response.status, message);
          return details
            ? { error: message, status: response.status, details }
            : { error: message, status: response.status };
        }
        if ("data" in json) {
          return { data: json.data as T };
        }
      }

      return { data: json as T };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Network request failed";
      apiLogger.error("Fetch failed", { path, message });
      return { error: message, status: 0 };
    }
  }

  get<T>(path: string, options?: Omit<FetchOptions, "method" | "body">) {
    return this.fetch<T>(path, { ...options, method: "GET" });
  }

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) {
    return this.fetch<T>(path, { ...options, method: "POST", body });
  }

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) {
    return this.fetch<T>(path, { ...options, method: "PUT", body });
  }

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) {
    return this.fetch<T>(path, { ...options, method: "PATCH", body });
  }

  delete<T>(
    path: string,
    body?: unknown,
    options?: Omit<FetchOptions, "method" | "body">
  ) {
    return this.fetch<T>(path, { ...options, method: "DELETE", body });
  }
}

function extractErrorMessage(json: unknown, status: number): string {
  if (json && typeof json === "object") {
    const body = json as ApiErrorBody;
    if (body.message) return body.message;
    if (body.error) return body.error;
  }
  return `Request failed with status ${status}`;
}

/** Preserve structured error fields (e.g. entitlement payloads) beyond the message. */
function extractErrorDetails(json: unknown): AppErrorDetails | undefined {
  if (!json || typeof json !== "object") {
    return undefined;
  }

  const body = json as Record<string, unknown>;
  const details: AppErrorDetails = {};

  for (const [key, value] of Object.entries(body)) {
    if (key === "message" || key === "error" || key === "success") {
      continue;
    }
    details[key] = value;
  }

  return Object.keys(details).length > 0 ? details : undefined;
}

/** Default singleton instance */
export const apiFetcher = new ApiFetcher();
