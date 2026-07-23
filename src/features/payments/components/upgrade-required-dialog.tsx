"use client";

import { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { paymentsService } from "@/features/payments/services/payments-service";
import type { PaymentPlan, PaymentPrice } from "@/features/payments/types";
import {
  formatPaymentAmount,
  formatPaymentPriceDuration,
  formatPaymentPricePeriodSuffix,
  sortPaymentPrices,
} from "@/features/payments/utils/format-payment-price";
import { openStripeCheckout } from "@/features/payments/utils/open-stripe-hosted-page";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type UpgradeRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Upgrade paywall dialog — plan features + selectable billing durations.
 * Opened from 402 responses or the account menu Upgrade action.
 */
export function UpgradeRequiredDialog({
  open,
  onOpenChange,
}: UpgradeRequiredDialogProps) {
  const [plan, setPlan] = useState<PaymentPlan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);

  const prices = useMemo(() => {
    if (!plan) {
      return [] as PaymentPrice[];
    }
    return sortPaymentPrices(plan.prices.filter((price) => price.active));
  }, [plan]);

  const selectedPrice =
    prices.find((price) => price.stripePriceId === selectedPriceId) ??
    prices[0] ??
    null;

  const features = useMemo(() => {
    if (!plan?.features || !Array.isArray(plan.features)) {
      return [] as string[];
    }
    return plan.features.filter(
      (feature): feature is string =>
        typeof feature === "string" && feature.trim().length > 0
    );
  }, [plan]);

  useEffect(() => {
    if (!open) {
      return;
    }

    let cancelled = false;

    async function loadPlan() {
      setIsLoadingPlan(true);
      setLoadError(null);

      const response = await paymentsService.getPlans();
      if (cancelled) {
        return;
      }

      if (!isSuccessResponse(response)) {
        setPlan(null);
        setSelectedPriceId(null);
        setLoadError(response.error || "Unable to load plans");
        setIsLoadingPlan(false);
        return;
      }

      const nextPlan = response.data.plans[0] ?? null;
      const nextPrices = nextPlan
        ? sortPaymentPrices(nextPlan.prices.filter((price) => price.active))
        : [];

      setPlan(nextPlan);
      setSelectedPriceId(nextPrices[0]?.stripePriceId ?? null);
      setLoadError(nextPlan ? null : "No upgrade plans are available right now");
      setIsLoadingPlan(false);
    }

    void loadPlan();

    return () => {
      cancelled = true;
    };
  }, [open]);

  async function handleUpgrade() {
    if (isCheckoutPending || !selectedPrice) {
      return;
    }

    setIsCheckoutPending(true);
    const navigated = await openStripeCheckout(selectedPrice.stripePriceId);
    if (!navigated) {
      setIsCheckoutPending(false);
    }
  }

  const selectedAmount = selectedPrice
    ? formatPaymentAmount(selectedPrice.unitAmount, selectedPrice.currency)
    : null;
  const selectedSuffix = selectedPrice
    ? formatPaymentPricePeriodSuffix(selectedPrice)
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={CrownIcon} strokeWidth={2} className="size-7" />
          </div>
          <DialogTitle className="text-xl">
            {plan?.name ? `Upgrade to ${plan.name}` : "Upgrade to continue"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {plan?.description?.trim() ||
              "Upgrade to unlock more features."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingPlan ? (
          <div className="space-y-3 py-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="h-20 animate-pulse rounded-2xl bg-muted" />
              <div className="h-20 animate-pulse rounded-2xl bg-muted" />
              <div className="h-20 animate-pulse rounded-2xl bg-muted" />
            </div>
          </div>
        ) : loadError ? (
          <p className="py-4 text-center text-sm text-destructive">{loadError}</p>
        ) : (
          <div className="flex flex-col gap-5">
            {features.length > 0 ? (
              <ul className="flex flex-col gap-2.5">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        className="size-3"
                        strokeWidth={2}
                      />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {prices.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-medium text-foreground">
                  Billing period
                </p>
                <div
                  role="radiogroup"
                  aria-label="Billing period"
                  className={cn(
                    "grid gap-2.5",
                    prices.length === 1
                      ? "grid-cols-1"
                      : prices.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                  )}
                >
                  {prices.map((price) => {
                    const selected =
                      price.stripePriceId === selectedPrice?.stripePriceId;
                    const amount = formatPaymentAmount(
                      price.unitAmount,
                      price.currency
                    );

                    return (
                      <button
                        key={price.stripePriceId}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setSelectedPriceId(price.stripePriceId)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-3 text-center transition-colors",
                          selected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border bg-card text-foreground hover:bg-muted/40"
                        )}
                      >
                        <span className="text-xs font-medium">
                          {formatPaymentPriceDuration(price)}
                        </span>
                        <span className="text-sm font-semibold tracking-tight">
                          {amount}
                          <span className="text-xs font-medium opacity-80">
                            {formatPaymentPricePeriodSuffix(price)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                No pricing options are available.
              </p>
            )}

            {selectedAmount ? (
              <p className="text-center text-sm text-muted-foreground">
                Selected:{" "}
                <span className="font-semibold text-foreground">
                  {selectedAmount}
                  {selectedSuffix}
                </span>
                {selectedPrice
                  ? ` · ${formatPaymentPriceDuration(selectedPrice)}`
                  : null}
              </p>
            ) : null}
          </div>
        )}

        <DialogFooter className="sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1"
            disabled={isCheckoutPending}
            onClick={() => onOpenChange(false)}
          >
            Not now
          </Button>
          <Button
            type="button"
            className="sm:flex-1"
            disabled={
              isCheckoutPending ||
              isLoadingPlan ||
              !selectedPrice ||
              Boolean(loadError)
            }
            onClick={() => {
              if (!selectedPrice) {
                toast.error("Select a billing period to continue");
                return;
              }
              void handleUpgrade();
            }}
          >
            {isCheckoutPending
              ? "Redirecting..."
              : selectedAmount
                ? `Upgrade · ${selectedAmount}${selectedSuffix}`
                : "Upgrade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
