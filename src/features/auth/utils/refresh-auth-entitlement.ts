import { paymentsService } from "@/features/payments/services/payments-service";
import type { PaymentEntitlement } from "@/features/payments/types";
import type { AppDispatch } from "@/lib/store";
import { setEntitlement } from "@/lib/store/auth-slice";
import { isSuccessResponse } from "@/lib/types/response";

/**
 * Fetches GET `/payments/me/entitlement` for the authenticated user.
 * Returns `null` when the request fails.
 */
export async function fetchAuthEntitlement(): Promise<PaymentEntitlement | null> {
  const response = await paymentsService.getMyEntitlement();

  if (!isSuccessResponse(response)) {
    return null;
  }

  return response.data.entitlement;
}

/**
 * Fetches the current entitlement and stores it on auth state.
 */
export async function refreshAuthEntitlement(
  dispatch: AppDispatch
): Promise<{ entitlement: PaymentEntitlement | null; error?: string }> {
  const response = await paymentsService.getMyEntitlement();

  if (!isSuccessResponse(response)) {
    dispatch(setEntitlement(null));
    return { entitlement: null, error: response.error };
  }

  const entitlement = response.data.entitlement;
  dispatch(setEntitlement(entitlement));
  return { entitlement };
}
