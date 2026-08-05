/** Optional metadata attached to successful responses. */
export type ResponseMetadata = {
  /** Total count for paginated results */
  total?: number;
  /** Current page for paginated results */
  page?: number;
};

/** API error codes for draft/publish latch failures and quota. */
export const API_ERROR_CODES = {
  PUBLISH_REQUIREMENTS_NOT_MET: "PUBLISH_REQUIREMENTS_NOT_MET",
  ENTITLEMENT_LIMIT: "ENTITLEMENT_LIMIT",
} as const;

/**
 * Extra fields from an API error body beyond `message` / `error`
 * (e.g. entitlement limit payloads with `code`, `key`, `limit`).
 */
export type AppErrorDetails = {
  code?: string;
  /** Field paths missing for publish / profile completion */
  missingFields?: string[];
  [key: string]: unknown;
};

/**
 * Standard response shape for client-side API calls and form submissions.
 * Use `{ data }` on success or `{ error, status }` on failure.
 */
export type AppResponseType<T> =
  | { data: T; metadata?: ResponseMetadata }
  | { error: string; status: number; details?: AppErrorDetails };

/** Type guard for successful responses */
export function isSuccessResponse<T>(
  response: AppResponseType<T>
): response is { data: T; metadata?: ResponseMetadata } {
  return "data" in response;
}

/** Type guard for failed responses */
export function isErrorResponse<T>(
  response: AppResponseType<T>
): response is { error: string; status: number; details?: AppErrorDetails } {
  return "error" in response;
}

/** True when the API rejected the current credentials. */
export function isUnauthorizedResponse(
  response: AppResponseType<unknown>
): boolean {
  return isErrorResponse(response) && response.status === 401;
}

/** True when the API requires a paid subscription (HTTP 402). */
export function isPaymentRequiredResponse(
  response: AppResponseType<unknown>
): response is { error: string; status: 402; details?: AppErrorDetails } {
  return isErrorResponse(response) && response.status === 402;
}

/**
 * True when publish/complete was requested but minima are not met.
 * Request data may still have been saved; latch stays draft/incomplete.
 */
export function isPublishRequirementsNotMet(
  response: AppResponseType<unknown>
): response is {
  error: string;
  status: 400;
  details?: AppErrorDetails;
} {
  return (
    isErrorResponse(response) &&
    response.status === 400 &&
    response.details?.code === API_ERROR_CODES.PUBLISH_REQUIREMENTS_NOT_MET
  );
}

/** Extracts `missingFields` from a publish-requirements error response. */
export function getMissingFields(
  response: AppResponseType<unknown>
): string[] {
  if (!isErrorResponse(response)) {
    return [];
  }
  const fields = response.details?.missingFields;
  return Array.isArray(fields)
    ? fields.filter((field): field is string => typeof field === "string")
    : [];
}
