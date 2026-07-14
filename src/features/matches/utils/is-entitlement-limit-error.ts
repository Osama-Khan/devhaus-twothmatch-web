import type { AppResponseType } from "@/lib/types/response";
import { isErrorResponse } from "@/lib/types/response";

/**
 * True when the API responded with 403 (treated as an entitlement limit).
 */
export function isEntitlementLimitError(
  response: AppResponseType<unknown>
): response is { error: string; status: 403 } {
  return isErrorResponse(response) && response.status === 403;
}
