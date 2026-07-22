import type { UserRole } from "@/lib/types/entities";

/** Stripe-style recurring interval on a price */
export type PaymentPriceInterval = "day" | "week" | "month" | "year";

/** Stripe price billing type */
export type PaymentPriceType = "recurring" | "one_time";

/** Feature limit / reset config on plan product definitions */
export type PaymentFeatureFlag = {
  limit: number | null;
  reset: string;
};

/** Map of feature key → plan limit config (e.g. `job_posts`) */
export type PaymentFeatureFlags = Record<string, PaymentFeatureFlag>;

/**
 * Entitlement feature keys from the payments API.
 */
export type PaymentEntitlementFeatureKey =
  | "free_swipes"
  | "interviews"
  | "detail_views"
  | "chat_matches"
  | "job_posts"
  | (string & {});

/** Usage / limit fields returned by the payments API for one feature */
export type PaymentEntitlementFeaturePayload = {
  /** Max uses in the reset window; `null` means unlimited */
  limit: number | null;
  /** Consumed uses in the current window */
  used: number;
};

/**
 * Feature usage snapshot stored in auth state.
 * `allowed` is derived client-side (`limit === null || used < limit`).
 */
export type PaymentEntitlementFeature = PaymentEntitlementFeaturePayload & {
  allowed: boolean;
};

/** Map of feature key → API usage/limit payload (no derived fields) */
export type PaymentEntitlementFeaturesPayload = Record<
  PaymentEntitlementFeatureKey,
  PaymentEntitlementFeaturePayload
>;

/** Map of feature key → usage/limit data with derived `allowed` */
export type PaymentEntitlementFeatures = Record<
  PaymentEntitlementFeatureKey,
  PaymentEntitlementFeature
>;

/** Opaque string map from Stripe / product metadata */
export type PaymentMetadata = Record<string, string>;

/**
 * Stripe subscription status values commonly returned by the API.
 * Kept as a string union of known values; unknown statuses may appear.
 */
export type PaymentSubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid";

/** Proration behavior when changing subscription plan */
export type PaymentProrationBehavior =
  | "create_prorations"
  | "none"
  | "always_invoice";

/** Price row nested under a plan or subscription item */
export type PaymentPrice = {
  id: string;
  stripePriceId: string;
  currency: string;
  /** Amount in the smallest currency unit (e.g. pence) */
  unitAmount: number;
  type: PaymentPriceType;
  interval: PaymentPriceInterval | null;
  intervalCount: number | null;
  trialPeriodDays: number | null;
  active: boolean;
  lookupKey: string | null;
  metadata: PaymentMetadata;
};

/** Active product + prices for the authenticated user's role */
export type PaymentPlan = {
  id: string;
  stripeProductId: string;
  planCode: string;
  name: string;
  description: string | null;
  active: boolean;
  role: UserRole;
  features: PaymentFeatureFlags;
  metadata: PaymentMetadata;
  prices: PaymentPrice[];
};

/** Effective entitlement as returned by the payments API */
export type PaymentEntitlementPayload = {
  isActive: boolean;
  onFreePlan: boolean;
  status: PaymentSubscriptionStatus | string;
  stripeSubscriptionId: string | null;
  planCode: string;
  tier: string;
  trialEnd: string | null;
  currentPeriodEnd: string | null;
  features: PaymentEntitlementFeaturesPayload;
};

/**
 * Effective entitlement stored in auth state.
 * Feature `allowed` flags are derived when mapping the API payload.
 */
export type PaymentEntitlement = Omit<PaymentEntitlementPayload, "features"> & {
  features: PaymentEntitlementFeatures;
};

/** Line item on a local subscription mirror */
export type PaymentSubscriptionItem = {
  id: string;
  stripeSubscriptionItemId: string;
  quantity: number;
  price: PaymentPrice;
};

/** Local subscription mirror; may be null when the user is on a free plan */
export type PaymentSubscription = {
  id: string;
  stripeSubscriptionId: string;
  status: PaymentSubscriptionStatus | string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart: string | null;
  trialEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  cancelAt: string | null;
  items: PaymentSubscriptionItem[];
  entitlement: PaymentEntitlementPayload;
};

/** Saved Stripe payment method for the authenticated user */
export type PaymentMethod = {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: string;
  cardBrand: string | null;
  cardLast4: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

/** Invoice row for billing history */
export type PaymentInvoice = {
  id: string;
  stripeInvoiceId: string;
  status: string;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  currency: string;
  hostedInvoiceUrl: string | null;
  invoicePdfUrl: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  paidAt: string | null;
  createdAt: string;
};

/** Pagination metadata for invoice lists */
export type PaymentsPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** Query params for GET `/payments/me/invoices` */
export type ListPaymentInvoicesParams = {
  /** Default 1 */
  page?: number;
  /** Default 20, max 50 */
  limit?: number;
};
