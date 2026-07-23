import type {
  PaymentEntitlementPayload,
  PaymentInvoice,
  PaymentMethod,
  PaymentPlan,
  PaymentSubscription,
  PaymentsPagination,
} from "@/features/payments/types/payment";

/** Response from GET `/payments/publishable-key` */
export type GetStripePublishableKeyResponse = {
  stripePublishableKey: string;
};

/** Response from GET `/payments/plans` */
export type GetPaymentPlansResponse = {
  plans: PaymentPlan[];
};

/**
 * Response from GET `/payments/me/subscription`.
 * `subscription` is null when the user is on a free plan.
 */
export type GetMySubscriptionResponse = {
  subscription: PaymentSubscription | null;
  entitlement: PaymentEntitlementPayload;
};

/** Response from GET `/payments/me/entitlement` */
export type GetMyEntitlementResponse = {
  entitlement: PaymentEntitlementPayload;
};

/** Response from GET `/payments/me/payment-methods` */
export type GetMyPaymentMethodsResponse = {
  paymentMethods: PaymentMethod[];
};

/** Response from GET `/payments/me/invoices` */
export type ListMyInvoicesResponse = {
  invoices: PaymentInvoice[];
  pagination: PaymentsPagination;
};

/** Response from GET `/payments/me/invoices/:invoiceId` */
export type GetMyInvoiceResponse = {
  invoice: PaymentInvoice;
};

/** Response from POST `/payments/setup-intent` */
export type CreateSetupIntentResponse = {
  clientSecret: string;
  customerId: string;
};

/** Response from POST `/payments/subscriptions` (201) */
export type CreateSubscriptionResponse = {
  subscriptionId: string;
  status: string;
  /** Present when 3DS is required on the latest invoice */
  clientSecret: string | null;
};

/** Response from POST `/payments/checkout` */
export type CreateCheckoutSessionResponse = {
  url: string;
  sessionId: string;
};

/** Response from POST `/payments/billing-portal` */
export type CreateBillingPortalSessionResponse = {
  url: string;
};

/** Generic success ack from payment mutation endpoints */
export type PaymentOkResponse = {
  ok: true;
};
