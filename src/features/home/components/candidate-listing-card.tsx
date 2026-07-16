"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Cancel01Icon,
  Clock01Icon,
  FavouriteIcon,
  Hospital02Icon,
  Location01Icon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import { MatchBadge } from "@/features/home/components/match-badge";
import type { CandidateListing } from "@/features/home/types/feed-candidates";
import { ScheduleInterviewButton } from "@/features/interviews/components/schedule-interview-button";
import { matchesService } from "@/features/matches/services/matches-service";
import type { MatchDecision } from "@/features/matches/types";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";

const META_ICONS: IconSvgElement[] = [
  Location01Icon,
  Hospital02Icon,
  Clock01Icon,
  Briefcase07Icon,
  MoneyBag02Icon,
];

type CandidateListingCardProps = {
  candidate: CandidateListing;
  isSelected?: boolean;
  onSelect?: () => void;
  /** Called after a successful like or pass so the feed can drop the card */
  onSwiped?: (candidateId: string, decision: MatchDecision) => void;
  className?: string;
};

/** Single candidate listing card in the center feed */
export function CandidateListingCard({
  candidate,
  isSelected,
  onSelect,
  onSwiped,
  className,
}: CandidateListingCardProps) {
  const [pendingDecision, setPendingDecision] = useState<MatchDecision | null>(
    null
  );

  async function handleSwipe(decision: MatchDecision) {
    if (pendingDecision != null) {
      return;
    }

    setPendingDecision(decision);

    const response = await matchesService.likeTarget({
      targetType: "candidate",
      targetId: candidate.id,
      decision,
    });

    if (!isSuccessResponse(response)) {
      toast.error(response.error);
      setPendingDecision(null);
      return;
    }

    if (decision === "like") {
      toast.success(
        response.data.match
          ? "It's a match!"
          : `Liked ${candidate.posterName}`
      );
    } else {
      toast.success("Passed");
    }

    onSwiped?.(candidate.id, decision);
    setPendingDecision(null);
  }

  const isBusy = pendingDecision != null;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.();
        }
      }}
      className={cn(
        "cursor-pointer rounded-2xl border bg-card p-5 shadow-sm transition-colors",
        isSelected ? "border-primary ring-1 ring-primary/20" : "border-border",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {candidate.isNew ? (
            <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-primary uppercase">
              New
            </span>
          ) : null}
          <Avatar>
            <AvatarImage src={candidate.avatar} alt={candidate.posterName} />
            <AvatarFallback>{getInitials(candidate.posterName)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-muted-foreground">
            {candidate.posterName}
          </span>
        </div>
        {candidate.matchPercent != null ? (
          <MatchBadge percent={candidate.matchPercent} />
        ) : null}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {candidate.title}
      </h3>
      <p className="mt-1 text-xl font-semibold text-primary">
        {candidate.rate}
      </p>

      {candidate.requirements && candidate.requirements.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {candidate.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {candidate.meta.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          {candidate.meta.map((item, index) => {
            const Icon = META_ICONS[index % META_ICONS.length];

            return (
              <div key={`${item.label}-${item.value}`} className="flex gap-2">
                <HugeiconsIcon
                  icon={Icon}
                  strokeWidth={2}
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div
        className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch"
        onClick={(event) => event.stopPropagation()}
      >
        <Button
          type="button"
          variant="outline"
          className="sm:flex-1"
          disabled={isBusy}
          onClick={() => void handleSwipe("pass")}
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          {pendingDecision === "pass" ? "Passing…" : "Pass"}
        </Button>

        <ScheduleInterviewButton
          candidateUserId={candidate.posterUserId}
          candidateName={candidate.posterName}
          className="sm:flex-[1.4]"
        />

        <Button
          type="button"
          variant="default"
          className="sm:flex-1"
          disabled={isBusy}
          onClick={() => void handleSwipe("like")}
        >
          <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} />
          {pendingDecision === "like" ? "Liking…" : "Like"}
        </Button>
      </div>
    </article>
  );
}
