"use client";

import { SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  REFINE_JD_MAX_CHARS,
  REFINE_JD_MIN_CHARS,
} from "@/features/jobs/constants";
import { useRefineJobDescription } from "@/features/jobs/hooks/use-refine-job-description";
import { cn } from "@/lib/utils";

type RefineJobDescriptionBadgeProps = {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  /** When true (e.g. AI generate toggle on), hide the refine control */
  hidden?: boolean;
};

const DISABLED_TOOLTIP =
  "Job description needs to be between 100-1000 letters to refine";

/**
 * Right-aligned Refine control under the permanent job description field.
 * Streams refined text from `/ai/jobs/refine-jd` when clicked.
 */
export function RefineJobDescriptionBadge({
  jobDescription,
  onJobDescriptionChange,
  hidden = false,
}: RefineJobDescriptionBadgeProps) {
  const { canRefine, isRefining, refine } = useRefineJobDescription({
    jobDescription,
    onJobDescriptionChange,
  });

  if (hidden) {
    return null;
  }

  const lengthOk =
    jobDescription.length >= REFINE_JD_MIN_CHARS &&
    jobDescription.length <= REFINE_JD_MAX_CHARS;
  const showDisabledTooltip = !lengthOk && !isRefining;

  const badge = (
    <Badge
      asChild
      variant="soft"
      className={cn(
        "h-6 cursor-pointer gap-1 px-2.5 text-xs font-semibold",
        (!canRefine || isRefining) &&
          "cursor-not-allowed opacity-50 hover:bg-primary/10"
      )}
    >
      <button
        type="button"
        disabled={!canRefine}
        aria-disabled={!canRefine}
        onClick={refine}
      >
        <HugeiconsIcon icon={SparklesIcon} strokeWidth={2} data-icon="inline-start" />
        {isRefining ? "Refining…" : "Refine"}
      </button>
    </Badge>
  );

  return (
    <div className="flex justify-end">
      {showDisabledTooltip ? (
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">{badge}</span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              {DISABLED_TOOLTIP}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        badge
      )}
    </div>
  );
}
