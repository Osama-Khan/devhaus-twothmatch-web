"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Calendar03Icon,
  Clock01Icon,
  Hospital02Icon,
  Location01Icon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { MatchBadge } from "@/features/home/components/match-badge";
import type { JobListing } from "@/features/home/types/job-listing";
import { cn } from "@/lib/utils";

const META_ICONS: IconSvgElement[] = [
  Location01Icon,
  Hospital02Icon,
  Clock01Icon,
  Briefcase07Icon,
  MoneyBag02Icon,
];

type JobCardProps = {
  job: JobListing;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
};

/** Single job listing card in the center feed */
export function JobCard({ job, isSelected, onSelect, className }: JobCardProps) {
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
          {job.isNew ? (
            <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-primary uppercase">
              New
            </span>
          ) : null}
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
            {job.posterInitials}
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {job.posterName}
          </span>
        </div>
        {job.matchPercent != null ? (
          <MatchBadge percent={job.matchPercent} />
        ) : null}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-foreground">{job.title}</h3>
      <p className="mt-1 text-xl font-semibold text-primary">{job.rate}</p>

      {job.requirements && job.requirements.length > 0 ? (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          {job.requirements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {job.meta.length > 0 ? (
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          {job.meta.map((item, index) => {
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

      <Button
        variant="secondary"
        className="mt-5 w-full"
        type="button"
        onClick={(event) => event.stopPropagation()}
      >
        <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
        Calendar
      </Button>
    </article>
  );
}
