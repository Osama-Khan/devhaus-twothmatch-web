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
