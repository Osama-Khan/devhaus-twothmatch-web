"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { openUpgradeDialog } from "@/features/payments/utils/open-upgrade-dialog";
import { cn } from "@/lib/utils";

type CandidateDetailUpgradePromptProps = {
  className?: string;
  /** Compact layout for the narrower left profile column */
  compact?: boolean;
};

/**
 * Inline upgrade prompt shown in candidate detail panes when the API
 * returns a payment-required error (`isPaymentRequiredResponse`).
 */
export function CandidateDetailUpgradePrompt({
  className,
  compact = false,
}: CandidateDetailUpgradePromptProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm",
        compact ? "gap-3" : "gap-4",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HugeiconsIcon icon={CrownIcon} strokeWidth={2} className="size-6" />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-foreground">
          Upgrade to view details
        </p>
        <p className="text-sm text-muted-foreground">
          Profile details are part of TwothMatch Pro. Upgrade to unlock full
          profile and preference details.
        </p>
      </div>
      <Button type="button" size="sm" onClick={() => openUpgradeDialog()}>
        Upgrade
      </Button>
    </div>
  );
}
