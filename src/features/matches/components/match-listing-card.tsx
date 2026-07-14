"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  BubbleChatIcon,
  Clock01Icon,
  Folder01Icon,
  ProtectionMaskIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import type { MatchListItem } from "@/features/matches/types";
import {
  formatMatchTargetTypeLabel,
  getMatchCardDisplay,
} from "@/features/matches/utils/format-match-display";
import type { UserRole } from "@/lib/types/entities";
import { cn } from "@/lib/utils";

type MatchListingCardProps = {
  match: MatchListItem;
  viewerRole?: UserRole;
  className?: string;
};

/**
 * Mutual match list card — header, job details pills, skills, and chat CTA.
 */
export function MatchListingCard({
  match,
  viewerRole,
  className,
}: MatchListingCardProps) {
  const display = getMatchCardDisplay(match, viewerRole);
  const typeLabel = formatMatchTargetTypeLabel(display.targetType);
  const isLocum = display.targetType === "locum";
  const isPermanent = display.targetType === "permanent";
  const hasJobDetails =
    display.detailPills.length > 0 ||
    display.showPpe ||
    display.showDocsRequired;
  const hasSkills =
    display.skills.length > 0 || display.specialisms.length > 0;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-3xl bg-card shadow-sm",
        isLocum && "border-l-4 border-l-locum",
        isPermanent && "border-l-4 border-l-permanent",
        !isLocum && !isPermanent && "border-l-4 border-l-primary",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            {display.avatar ? (
              <AvatarImage src={display.avatar} alt={display.name} />
            ) : null}
            <AvatarFallback>{getInitials(display.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-foreground">
                  {display.name}
                </h3>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">
                  {display.subtitle}
                </p>
                {display.badgeLabel ? (
                  <span className="mt-2 inline-flex rounded-full bg-locum-soft px-2.5 py-0.5 text-xs font-medium text-locum-foreground">
                    {display.badgeLabel}
                  </span>
                ) : null}
              </div>

              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1",
                  "bg-[color-mix(in_srgb,var(--chart-3)_80%,white)] text-xs font-bold text-[var(--chart-2)]"
                )}
              >
                {display.score}% Match
              </span>
            </div>
          </div>
        </div>

        {hasJobDetails ? (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground">
              Job Details
            </p>
            {display.detailPills.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {display.detailPills.map((pill) => (
                  <span
                    key={pill.key}
                    className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <HugeiconsIcon
                      icon={pill.icon}
                      strokeWidth={2}
                      className="size-3.5 shrink-0"
                    />
                    {pill.label}
                  </span>
                ))}
              </div>
            ) : null}

            {display.showPpe || display.showDocsRequired ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {display.showPpe ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-locum-soft px-3 py-1.5 text-xs font-medium text-locum-foreground">
                    <HugeiconsIcon
                      icon={ProtectionMaskIcon}
                      strokeWidth={2}
                      className="size-3.5 shrink-0"
                    />
                    PPE
                  </span>
                ) : null}
                {display.showDocsRequired ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-permanent-soft px-3 py-1.5 text-xs font-medium text-permanent-foreground">
                    <HugeiconsIcon
                      icon={Folder01Icon}
                      strokeWidth={2}
                      className="size-3.5 shrink-0"
                    />
                    Docs Required
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}

        {hasSkills ? (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground">Skills</p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {display.skills.map((skill) => (
                <span
                  key={`skill-${skill}`}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {display.specialisms.map((specialism) => (
                <span
                  key={`specialism-${specialism}`}
                  className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
                >
                  {specialism}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
              isLocum && "bg-locum-soft text-locum-foreground",
              isPermanent && "bg-permanent-soft text-permanent-foreground",
              !isLocum && !isPermanent && "bg-primary/10 text-primary"
            )}
          >
            {typeLabel}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <HugeiconsIcon
              icon={Clock01Icon}
              strokeWidth={2}
              className="size-3.5 shrink-0"
            />
            {display.matchedAtLabel}
          </span>
        </div>

        <Button type="button" className="mt-4 w-full gap-2" disabled>
          <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={2} />
          Chat
        </Button>
      </div>
    </article>
  );
}
