import type { AppErrorDetails, AppResponseType } from "@/lib/types/response";
import { isPaymentRequiredResponse } from "@/lib/types/response";

/**
 * True when the API responded with 402 (payment / entitlement limit).
 */
export function isEntitlementLimitError(
  response: AppResponseType<unknown>
): response is { error: string; status: 402; details?: AppErrorDetails } {
  return isPaymentRequiredResponse(response);
}
