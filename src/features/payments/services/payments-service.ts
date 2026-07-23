"use client";

import type {
  CancelSubscriptionRequest,
  ChangeSubscriptionPlanRequest,
  CreateSetupIntentResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  GetMyEntitlementResponse,
  GetMyInvoiceResponse,
  GetMyPaymentMethodsResponse,
  GetMySubscriptionResponse,
  GetPaymentPlansResponse,
  GetStripePublishableKeyResponse,
  ListMyInvoicesResponse,
  ListPaymentInvoicesParams,
  PaymentOkResponse,
} from "@/features/payments/types";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";
import { createRoute } from "@/lib/utils/route";

function buildInvoicesPath(params?: ListPaymentInvoicesParams): string {
  const searchParams = new URLSearchParams();

  if (params?.page != null) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit != null) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  const base = externalApiRoutes.payments.me.invoices._self.path;

  return query ? `${base}?${query}` : base;
}

function invoiceByIdPath(invoiceId: string): string {
  return createRoute(externalApiRoutes.payments.me.invoiceById._self, {
    invoiceId,
  }).path;
}

function paymentMethodDefaultPath(stripePaymentMethodId: string): string {
  return createRoute(externalApiRoutes.payments.paymentMethodDefault._self, {
    stripePaymentMethodId,
  }).path;
}

function paymentMethodByIdPath(stripePaymentMethodId: string): string {
  return createRoute(externalApiRoutes.payments.paymentMethodById._self, {
    stripePaymentMethodId,
  }).path;
}

/**
 * Client-side payments / Stripe billing service.
 * Most endpoints require auth; `getPublishableKey` is public.
 */
export const paymentsService = {
  /**
   * GET `/payments/publishable-key` — Stripe publishable key for Elements /
   * Payment Element. No auth. **503** when Stripe is not configured.
   */
  getPublishableKey(): Promise<
    AppResponseType<GetStripePublishableKeyResponse>
  > {
    return apiFetcher.get<GetStripePublishableKeyResponse>(
      externalApiRoutes.payments.publishableKey._self.path,
      { skipAuth: true }
    );
  },

  /**
   * GET `/payments/plans` — active products + prices for the authenticated
   * user's role.
   */
  getPlans(): Promise<AppResponseType<GetPaymentPlansResponse>> {
    return apiFetcher.get<GetPaymentPlansResponse>(
      externalApiRoutes.payments.plans._self.path
    );
  },

  /**
   * GET `/payments/me/subscription` — current local subscription plus
   * entitlement. `subscription` may be `null` on a free plan.
   */
  getMySubscription(): Promise<AppResponseType<GetMySubscriptionResponse>> {
    return apiFetcher.get<GetMySubscriptionResponse>(
      externalApiRoutes.payments.me.subscription._self.path
    );
  },

  /**
   * GET `/payments/me/entitlement` — effective entitlement (paid or free plan).
   */
  getMyEntitlement(): Promise<AppResponseType<GetMyEntitlementResponse>> {
    return apiFetcher.get<GetMyEntitlementResponse>(
      externalApiRoutes.payments.me.entitlement._self.path
    );
  },

  /**
   * GET `/payments/me/payment-methods` — saved payment methods for the user.
   */
  getMyPaymentMethods(): Promise<AppResponseType<GetMyPaymentMethodsResponse>> {
    return apiFetcher.get<GetMyPaymentMethodsResponse>(
      externalApiRoutes.payments.me.paymentMethods._self.path
    );
  },

  /**
   * GET `/payments/me/invoices` — paginated invoices (`page` default 1,
   * `limit` default 20, max 50).
   */
  getMyInvoices(
    params?: ListPaymentInvoicesParams
  ): Promise<AppResponseType<ListMyInvoicesResponse>> {
    return apiFetcher.get<ListMyInvoicesResponse>(buildInvoicesPath(params));
  },

  /**
   * GET `/payments/me/invoices/:invoiceId` — single invoice by internal UUID
   * or Stripe invoice id (`in_…`).
   */
  getMyInvoice(
    invoiceId: string
  ): Promise<AppResponseType<GetMyInvoiceResponse>> {
    return apiFetcher.get<GetMyInvoiceResponse>(invoiceByIdPath(invoiceId));
  },

  /**
   * POST `/payments/setup-intent` — creates a SetupIntent; returns
   * `clientSecret` for Stripe Elements / Payment Element.
   */
  createSetupIntent(): Promise<AppResponseType<CreateSetupIntentResponse>> {
    return apiFetcher.post<CreateSetupIntentResponse>(
      externalApiRoutes.payments.setupIntent._self.path,
      {}
    );
  },

  /**
   * POST `/payments/payment-methods/:stripePaymentMethodId/default` — set
   * default payment method (`pm_…`).
   */
  setDefaultPaymentMethod(
    stripePaymentMethodId: string
  ): Promise<AppResponseType<PaymentOkResponse>> {
    return apiFetcher.post<PaymentOkResponse>(
      paymentMethodDefaultPath(stripePaymentMethodId),
      {}
    );
  },

  /**
   * DELETE `/payments/payment-methods/:stripePaymentMethodId` — detach a
   * payment method (`pm_…`).
   */
  detachPaymentMethod(
    stripePaymentMethodId: string
  ): Promise<AppResponseType<PaymentOkResponse>> {
    return apiFetcher.delete<PaymentOkResponse>(
      paymentMethodByIdPath(stripePaymentMethodId)
    );
  },

  /**
   * POST `/payments/subscriptions` — create a subscription (201). May return
   * `clientSecret` when 3DS is required.
   */
  createSubscription(
    body: CreateSubscriptionRequest
  ): Promise<AppResponseType<CreateSubscriptionResponse>> {
    return apiFetcher.post<CreateSubscriptionResponse>(
      externalApiRoutes.payments.subscriptions._self.path,
      body
    );
  },

  /**
   * POST `/payments/subscriptions/change` — change the active subscription
   * price (`price_…`).
   */
  changeSubscriptionPlan(
    body: ChangeSubscriptionPlanRequest
  ): Promise<AppResponseType<PaymentOkResponse>> {
    return apiFetcher.post<PaymentOkResponse>(
      externalApiRoutes.payments.changeSubscription._self.path,
      body
    );
  },

  /**
   * POST `/payments/subscriptions/cancel` — cancel at period end or immediately.
   */
  cancelSubscription(
    body: CancelSubscriptionRequest
  ): Promise<AppResponseType<PaymentOkResponse>> {
    return apiFetcher.post<PaymentOkResponse>(
      externalApiRoutes.payments.cancelSubscription._self.path,
      body
    );
  },

  /**
   * POST `/payments/subscriptions/resume` — undo cancel-at-period-end.
   */
  resumeSubscription(): Promise<AppResponseType<PaymentOkResponse>> {
    return apiFetcher.post<PaymentOkResponse>(
      externalApiRoutes.payments.resumeSubscription._self.path,
      {}
    );
  },
};
