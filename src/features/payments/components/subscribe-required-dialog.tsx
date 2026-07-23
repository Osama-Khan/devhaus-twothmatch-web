"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { openStripeCheckout } from "@/features/payments/utils/open-stripe-hosted-page";

type SubscribeRequiredDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional API error message to show under the title */
  message?: string;
};

/**
 * Paywall dialog — shown when an API request returns HTTP 402.
 */
export function SubscribeRequiredDialog({
  open,
  onOpenChange,
}: SubscribeRequiredDialogProps) {
  const [isCheckoutPending, setIsCheckoutPending] = useState(false);
  const description =
    "You've reached the limit on your current plan. Subscribe to unlock more features.";

  async function handleSubscribe() {
    if (isCheckoutPending) {
      return;
    }

    setIsCheckoutPending(true);
    const navigated = await openStripeCheckout();
    if (!navigated) {
      setIsCheckoutPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={CrownIcon} strokeWidth={2} className="size-7" />
          </div>
          <DialogTitle className="text-xl">Subscribe to continue</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

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
            disabled={isCheckoutPending}
            onClick={() => {
              void handleSubscribe();
            }}
          >
            {isCheckoutPending ? "Opening…" : "Subscribe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
