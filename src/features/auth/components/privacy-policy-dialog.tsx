"use client";

import { useEffect, useId, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Cancel01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSettingByType } from "@/features/config/hooks/use-setting-by-type";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type PrivacyPolicyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called when the user checks agreement and clicks Continue */
  onContinue: () => void;
};

/**
 * Resolves displayable privacy policy HTML/text from a settings API row.
 */
function resolvePolicyContent(
  items: { name: string; value?: string }[]
): string {
  const item = items[0];
  if (!item) {
    return "";
  }

  const value = item.value?.trim() ?? "";
  if (value.length > 0) {
    return value;
  }

  // Fallback if an older API returns the body in `name`
  if (item.name !== "privacy_policy") {
    return item.name.trim();
  }

  return "";
}

/**
 * Signup gate: shows privacy policy from `GET /settings/privacy_policy`.
 * Continue stays disabled until the user agrees.
 */
export function PrivacyPolicyDialog({
  open,
  onOpenChange,
  onContinue,
}: PrivacyPolicyDialogProps) {
  const agreeId = useId();
  const commsId = useId();
  const [agreed, setAgreed] = useState(false);
  const [commsOptIn, setCommsOptIn] = useState(false);
  const { items, isLoading, error } = useSettingByType("privacy_policy", open);

  const content = resolvePolicyContent(items);
  const canContinue =
    agreed && commsOptIn && !isLoading && !error && content.length > 0;

  useEffect(() => {
    if (!open) {
      setAgreed(false);
      setCommsOptIn(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="min-h-8 max-w-3xl! gap-0">
        <DialogHeader>
          <DialogTitle>
            Privacy Policy
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-3.5 right-3 text-foreground"
            >
              <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="h-5 border-b border-border"></div>

        <ScrollArea className="min-h-0 flex-1 max-h-[calc(100vh-30rem)]">
          <div>
            {isLoading ? (
              <div className="flex flex-col p-5 items-center justify-center">
                <HugeiconsIcon icon={Loading03Icon} strokeWidth={2} className="animate-spin" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">{error}</p>
            ) : content.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Privacy policy content is unavailable. Please try again later.
              </p>
            ) : (
              <>
                <div
                  className={cn(
                    "privacy-policy-content text-sm leading-relaxed",
                    "[&_h1]:mb-3 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-primary",
                    "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-primary",
                    "[&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-primary",
                    "[&_p]:mb-3 [&_p]:last:mb-0",
                    "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5",
                    "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5",
                    "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
                    "[&_strong]:font-semibold",
                    "[&_.section]:mb-4 [&_.contact]:space-y-1",
                  )}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
                <div className="h-3"></div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="shrink-0 space-y-4 border-border border-t pt-4">
          <div className="space-y-3">
            <Label htmlFor={agreeId}>
              <Checkbox
                id={agreeId}
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
              />
              I agree to Privacy Policy &amp; Terms
            </Label>

            <Label htmlFor={commsId} className="items-start leading-snug">
              <Checkbox
                id={commsId}
                checked={commsOptIn}
                onCheckedChange={(checked) => setCommsOptIn(checked === true)}
                className="mt-0.5"
              />
              I agree to receive communications from TwothMatch by email and
              WhatsApp about account updates, opportunities, and other relevant
              information.
            </Label>
          </div>

          <Button
            type="button"
            disabled={!canContinue}
            className="h-12 w-full gap-2 rounded-full text-base"
            onClick={onContinue}
          >
            Continue
            <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
