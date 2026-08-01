"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AiJdPublishingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

/**
 * Shown after a successful permanent job create when `useAiJd` is true.
 * Explains that the JD is generated before the listing goes live.
 */
export function AiJdPublishingDialog({
  open,
  onOpenChange,
  onConfirm,
}: AiJdPublishingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Publishing job</DialogTitle>
          <DialogDescription>
            We&apos;re generating your job description now. Once it&apos;s ready,
            your job will go live and we&apos;ll notify you.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" className="w-full sm:w-auto" onClick={onConfirm}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
