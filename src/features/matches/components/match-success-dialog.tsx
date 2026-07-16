"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import { appRoutes } from "@/lib/routes";

export type MatchSuccessTarget = {
  name: string;
  avatar: string | null;
  /** Match score percentage when available */
  score?: number;
};

type MatchSuccessDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: MatchSuccessTarget | null;
};

/**
 * Celebration dialog shown when PUT `/matches` returns a mutual `match`.
 */
export function MatchSuccessDialog({
  open,
  onOpenChange,
  target,
}: MatchSuccessDialogProps) {
  const name = target?.name?.trim() || "this candidate";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        className="sm:max-w-sm"
      >
        <DialogHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HugeiconsIcon icon={CrownIcon} strokeWidth={2} className="size-7" />
          </div>
          <DialogTitle className="text-xl">It&apos;s a match!</DialogTitle>
          <DialogDescription>
            You and {name} liked each other.
            {target?.score != null
              ? ` You're a ${target.score}% match.`
              : null}
          </DialogDescription>
        </DialogHeader>

        {target ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <Avatar className="size-20">
              {target.avatar ? (
                <AvatarImage src={target.avatar} alt={name} />
              ) : null}
              <AvatarFallback className="text-lg">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <p className="text-base font-semibold text-foreground">{name}</p>
          </div>
        ) : null}

        <DialogFooter className="sm:justify-stretch">
          <Button
            type="button"
            variant="outline"
            className="sm:flex-1"
            onClick={() => onOpenChange(false)}
          >
            Keep browsing
          </Button>
          <Button type="button" className="sm:flex-1" asChild>
            <Link href={appRoutes.nav.matches._self.path}>View matches</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
