import type { PaymentProrationBehavior } from "@/features/payments/types/payment";

/**
 * Body for POST `/payments/subscriptions`.
 * Omit `paymentMethodId` when the Stripe customer already has a default.
 */
export type CreateSubscriptionRequest = {
  /** Stripe Price id (`price_…`) */
  priceId: string;
  /** Stripe PaymentMethod id (`pm_…`); optional if customer default is set */
  paymentMethodId?: string;
};

/**
 * Body for POST `/payments/checkout`.
 * Opens Stripe-hosted Checkout for TwothMatch Pro.
 */
export type CreateCheckoutSessionRequest = {
  /** Absolute URL on this app after successful payment */
  successUrl: string;
  /** Absolute URL on this app if Checkout is cancelled */
  cancelUrl: string;
  /** Optional Stripe Price id (`price_…`); defaults to the role's Pro price */
  priceId?: string;
};

/**
 * Body for POST `/payments/billing-portal`.
 * Opens Stripe Customer Portal to manage the subscription.
 */
export type CreateBillingPortalSessionRequest = {
  /** Absolute URL on this app when leaving the portal */
  returnUrl: string;
};

/** Body for POST `/payments/subscriptions/change` */
export type ChangeSubscriptionPlanRequest = {
  /** Stripe Price id (`price_…`) */
  priceId: string;
  prorationBehavior?: PaymentProrationBehavior;
};

/** Body for POST `/payments/subscriptions/cancel` */
export type CancelSubscriptionRequest = {
  /** When true, ends access immediately; otherwise cancel at period end */
  immediate: boolean;
};
