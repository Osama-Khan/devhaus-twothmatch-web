"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import type { LikeListItem } from "@/features/matches/types";
import { getLikeCardDisplay } from "@/features/matches/utils/format-like-display";
import { cn } from "@/lib/utils";

type LikeListingCardProps = {
  like: LikeListItem;
  className?: string;
};

/**
 * Like list card — avatar, contextual badge copy, type badge, and liked-at date.
 */
export function LikeListingCard({ like, className }: LikeListingCardProps) {
  const display = getLikeCardDisplay(like);
  const isLocum = display.targetType === "locum";
  const isPermanent = display.targetType === "permanent";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl bg-card shadow-sm",
        className
      )}
    >
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-row gap-3 justify-between items-center">
          <span
            className={cn(
              "inline-flex max-w-full items-start gap-1.5 rounded-full px-2.5 py-1",
              "text-xs font-semibold",
              isLocum && "bg-locum-soft text-locum-foreground",
              isPermanent && "bg-permanent-soft text-permanent-foreground",
              !isLocum && !isPermanent && "bg-primary/10 text-primary"
            )}
          >
            <span className="text-left">
              {display.badgeText}
            </span>
          </span>
          <div className="text-muted-foreground text-xs">
            {display.likedAtLabel}
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            {display.avatar ? (
              <AvatarImage src={display.avatar} alt={display.name} />
            ) : null}
            <AvatarFallback>{getInitials(display.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-foreground">
              {display.name}
            </h3>
            {display.subtitle ? (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {display.subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
