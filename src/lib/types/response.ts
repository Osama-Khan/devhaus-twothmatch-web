/** Optional metadata attached to successful responses. */
export type ResponseMetadata = {
  /** Total count for paginated results */
  total?: number;
  /** Current page for paginated results */
  page?: number;
};

/**
 * Standard response shape for client-side API calls and form submissions.
 * Mirrors the Typr pattern — use `{ data }` on success or `{ error }` on failure.
 */
export type AppResponseType<T> =
  | { data: T; metadata?: ResponseMetadata }
  | { error: string };

/** Type guard for successful responses */
export function isSuccessResponse<T>(
  response: AppResponseType<T>
): response is { data: T; metadata?: ResponseMetadata } {
  return "data" in response;
}
