"use client";

import { useCallback } from "react";
import { SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfigIdSelect } from "@/features/jobs/components/config-id-select";
import { ConfigMultiSelect } from "@/features/jobs/components/config-multi-select";
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import { ConfigType } from "@/features/config/types/config-type";
import {
  REFINE_ABOUT_MAX_CHARS,
  REFINE_ABOUT_MIN_CHARS,
} from "@/features/onboarding/constants";
import { useGenerateAbout } from "@/features/onboarding/hooks/use-generate-about";
import { useRefineAbout } from "@/features/onboarding/hooks/use-refine-about";
import type { OnboardingStepProps } from "@/features/onboarding/types/onboarding-form";
import { cn } from "@/lib/utils";

const REFINE_DISABLED_TOOLTIP = `About needs to be between ${REFINE_ABOUT_MIN_CHARS}-${REFINE_ABOUT_MAX_CHARS} characters to refine`;

/** Step 6 — about, culture, benefits, and workload preferences */
export function CultureWorkEnvironmentStep({
  data,
  onChange,
}: OnboardingStepProps) {
  const { items: workloadOptions } = useConfigByType(ConfigType.WORK_LOAD);

  const { canGenerate, isGenerating, generate } = useGenerateAbout({
    onAboutChange: (value) => onChange("about", value),
  });

  const { canRefine, isRefining, refine } = useRefineAbout({
    about: data.about,
    onAboutChange: (value) => onChange("about", value),
    disabled: isGenerating,
  });

  const handleWorkloadChange = useCallback(
    (id: string) => {
      const selected = workloadOptions.find((item) => item.id === id);
      onChange("workloadStyleId", id);
      onChange("workloadStyleName", selected?.name ?? "");
    },
    [onChange, workloadOptions]
  );

  const isBusy = isGenerating || isRefining;
  const lengthOk =
    data.about.length >= REFINE_ABOUT_MIN_CHARS &&
    data.about.length <= REFINE_ABOUT_MAX_CHARS;
  const showRefineTooltip = !lengthOk && !isRefining && !isGenerating;

  const refineBadge = (
    <Badge
      asChild
      variant="soft"
      className={cn(
        "h-6 cursor-pointer gap-1 px-2.5 text-xs font-semibold",
        (!canRefine || isRefining) &&
          "cursor-not-allowed opacity-50 hover:bg-primary/10"
      )}
    >
      <button type="button" disabled={!canRefine} onClick={refine}>
        <HugeiconsIcon
          icon={SparklesIcon}
          strokeWidth={2}
          data-icon="inline-start"
        />
        {isRefining ? "Refining…" : "Refine"}
      </button>
    </Badge>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Culture &amp; Work Environment
        </h1>
        <p className="text-sm text-muted-foreground">Optional</p>
      </div>

      <div className="flex flex-col gap-5">
        <Field>
          <div className="flex flex-row items-center justify-between gap-2">
            <FieldLabel htmlFor="about">About your practice</FieldLabel>
            <Badge
              asChild
              variant="soft"
              className={cn(
                "h-6 cursor-pointer gap-1 px-2.5 text-xs font-semibold",
                (!canGenerate || isBusy) &&
                  "cursor-not-allowed opacity-50 hover:bg-primary/10"
              )}
            >
              <button
                type="button"
                disabled={!canGenerate}
                onClick={generate}
              >
                <HugeiconsIcon
                  icon={SparklesIcon}
                  strokeWidth={2}
                  data-icon="inline-start"
                />
                {isGenerating ? "Generating…" : "Generate with AI"}
              </button>
            </Badge>
          </div>
          <Textarea
            id="about"
            rows={5}
            value={data.about}
            placeholder="Tell candidates what makes your practice special…"
            className="max-h-60"
            disabled={isBusy}
            onChange={(event) => onChange("about", event.target.value)}
          />
          <div className="flex justify-end">
            {showRefineTooltip ? (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">{refineBadge}</span>
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>
                    {REFINE_DISABLED_TOOLTIP}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              refineBadge
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="clinicCultureDescriptors">
            Clinic Culture Descriptors
          </FieldLabel>
          <Input
            id="clinicCultureDescriptors"
            type="text"
            placeholder="Enter"
            value={data.clinicCultureDescriptors}
            onChange={(event) =>
              onChange("clinicCultureDescriptors", event.target.value)
            }
          />
        </Field>

        <ConfigMultiSelect
          label="Benefits Offered"
          configType={ConfigType.BENEFITS_OFFERED}
          value={data.benefitsOfferedIds}
          onValueChange={(value) => onChange("benefitsOfferedIds", value)}
        />

        <ConfigIdSelect
          id="workloadStyle"
          label="Workload style"
          configType={ConfigType.WORK_LOAD}
          value={data.workloadStyleId}
          onValueChange={handleWorkloadChange}
          placeholder="Select (optional)"
        />
      </div>
    </div>
  );
}
