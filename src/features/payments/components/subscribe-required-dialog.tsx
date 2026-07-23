"use client";

import Link from "next/link";
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
import { appRoutes } from "@/lib/routes";

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
  const description = "You've reached the limit on your current plan. Subscribe to unlock more features.";

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
            onClick={() => onOpenChange(false)}
          >
            Not now
          </Button>
          <Button type="button" className="sm:flex-1" asChild>
            <Link
              href={appRoutes.settings._self.path}
              onClick={() => onOpenChange(false)}
            >
              Subscribe
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
