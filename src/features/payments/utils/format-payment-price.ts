import type {
  PaymentPrice,
  PaymentPriceInterval,
} from "@/features/payments/types";

const INTERVAL_ORDER: Record<PaymentPriceInterval, number> = {
  day: 1,
  week: 7,
  month: 30,
  year: 365,
};

/** Approximate length of a billing period in days (for sorting). */
function intervalLengthDays(price: PaymentPrice): number {
  if (!price.interval) {
    return Number.MAX_SAFE_INTEGER;
  }

  const count = Math.max(1, price.intervalCount ?? 1);
  return INTERVAL_ORDER[price.interval] * count;
}

/**
 * Sort prices shortest → longest billing period.
 */
export function sortPaymentPrices(prices: PaymentPrice[]): PaymentPrice[] {
  return [...prices].sort(
    (a, b) => intervalLengthDays(a) - intervalLengthDays(b)
  );
}

/**
 * Human label for a price's billing duration (e.g. Monthly, Yearly).
 */
export function formatPaymentPriceDuration(price: PaymentPrice): string {
  const count = Math.max(1, price.intervalCount ?? 1);
  const interval = price.interval;

  if (!interval) {
    return "One-time";
  }

  if (count === 1) {
    switch (interval) {
      case "day":
        return "Daily";
      case "week":
        return "Weekly";
      case "month":
        return "Monthly";
      case "year":
        return "Yearly";
    }
  }

  if (interval === "month" && count === 3) {
    return "Quarterly";
  }

  if (interval === "month" && count === 6) {
    return "Every 6 months";
  }

  const unitLabel =
    interval === "day"
      ? "days"
      : interval === "week"
        ? "weeks"
        : interval === "month"
          ? "months"
          : "years";

  return `Every ${count} ${unitLabel}`;
}

/**
 * Format a Stripe unit amount for display (e.g. £29.00).
 */
export function formatPaymentAmount(
  unitAmount: number,
  currency: string
): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: unitAmount % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(unitAmount / 100);
}

/**
 * Short per-period suffix for a price (e.g. /mo, /yr).
 */
export function formatPaymentPricePeriodSuffix(price: PaymentPrice): string {
  const count = Math.max(1, price.intervalCount ?? 1);
  const interval = price.interval;

  if (!interval) {
    return "";
  }

  if (count === 1) {
    switch (interval) {
      case "day":
        return "/day";
      case "week":
        return "/wk";
      case "month":
        return "/mo";
      case "year":
        return "/yr";
    }
  }

  return ` / ${count}${interval.charAt(0)}`;
}
