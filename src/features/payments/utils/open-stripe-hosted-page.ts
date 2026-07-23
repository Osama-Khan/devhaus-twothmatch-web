import { paymentsService } from "@/features/payments/services/payments-service";
import { appRoutes } from "@/lib/routes";
import { isSuccessResponse } from "@/lib/types/response";
import { appEnv } from "@/lib/utils/env";
import { toast } from "sonner";

function absoluteAppUrl(path: string): string {
  const base = appEnv.siteUrl.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Current page URL on this app, falling back to the site home. */
function currentReturnUrl(): string {
  if (typeof window !== "undefined" && window.location?.href) {
    return window.location.href;
  }
  return absoluteAppUrl(appRoutes.home._self.path);
}

/**
 * Opens Stripe-hosted Checkout for TwothMatch Pro.
 * Returns true when the browser is navigating to Stripe.
 */
export async function openStripeCheckout(): Promise<boolean> {
  const returnUrl = currentReturnUrl();
  const response = await paymentsService.createCheckoutSession({
    successUrl: returnUrl,
    cancelUrl: returnUrl,
  });

  if (!isSuccessResponse(response)) {
    toast.error(response.error || "Unable to start checkout");
    return false;
  }

  window.location.assign(response.data.url);
  return true;
}

/**
 * Opens Stripe Customer Portal to manage the current subscription.
 * Returns true when the browser is navigating to Stripe.
 */
export async function openStripeBillingPortal(): Promise<boolean> {
  const response = await paymentsService.createBillingPortalSession({
    returnUrl: currentReturnUrl(),
  });

  if (!isSuccessResponse(response)) {
    toast.error(response.error || "Unable to open billing portal");
    return false;
  }

  window.location.assign(response.data.url);
  return true;
}
