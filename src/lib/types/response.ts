/** Optional metadata attached to successful responses. */
export type ResponseMetadata = {
  /** Total count for paginated results */
  total?: number;
  /** Current page for paginated results */
  page?: number;
};

/**
 * Standard response shape for client-side API calls and form submissions.
 * Use `{ data }` on success or `{ error, status }` on failure.
 */
export type AppResponseType<T> =
  | { data: T; metadata?: ResponseMetadata }
  | { error: string; status: number };

/** Type guard for successful responses */
export function isSuccessResponse<T>(
  response: AppResponseType<T>
): response is { data: T; metadata?: ResponseMetadata } {
  return "data" in response;
}

/** Type guard for failed responses */
export function isErrorResponse<T>(
  response: AppResponseType<T>
): response is { error: string; status: number } {
  return "error" in response;
}

/** True when the API rejected the current credentials. */
export function isUnauthorizedResponse(
  response: AppResponseType<unknown>
): boolean {
  return isErrorResponse(response) && response.status === 401;
}
