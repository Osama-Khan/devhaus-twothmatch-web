import type {
  PaymentEntitlement,
  PaymentEntitlementFeature,
  PaymentEntitlementFeatures,
  PaymentEntitlementPayload,
} from "@/features/payments/types";

/**
 * Whether a feature can still be used given its limit and usage.
 * Unlimited when `limit` is `null`.
 */
export function isEntitlementFeatureAllowed(
  limit: number | null,
  used: number
): boolean {
  return limit === null || used < limit;
}

/**
 * Maps an API entitlement payload into auth-ready entitlement with derived
 * `features.*.allowed` flags.
 */
export function mapPaymentEntitlement(
  entitlement: PaymentEntitlementPayload
): PaymentEntitlement {
  const features: PaymentEntitlementFeatures = {
    free_swipes: {
      limit: 5,
      used: 0,
      allowed: true,
    },
    interviews: {
      limit: 0,
      used: 0,
      allowed: false,
    },
    detail_views: {
      limit: 0,
      used: 0,
      allowed: false,
    },
    chat_matches: {
      limit: 0,
      used: 0,
      allowed: false,
    },
    job_posts: {
      limit: 0,
      used: 0,
      allowed: false,
    },
  };

  for (const [key, feature] of Object.entries(entitlement.features)) {
    const mapped: PaymentEntitlementFeature = {
      limit: feature.limit,
      used: feature.used,
      allowed: isEntitlementFeatureAllowed(feature.limit, feature.used),
    };
    features[key] = mapped;
  }

  return {
    ...entitlement,
    features,
  };
}
