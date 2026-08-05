"use client";

import { SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldError,
  RequiredFieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { RefineJobDescriptionBadge } from "@/features/jobs/components/refine-job-description-badge";
import { getPermanentStep6FieldError } from "@/features/jobs/form/permanent-job-step-schemas";
import { useGenerateJobDescription } from "@/features/jobs/hooks/use-generate-job-description";
import type { PermanentJobStepProps } from "@/features/jobs/types/permanent-job-form";
import { cn } from "@/lib/utils";

/** Step 6 — write or AI-generate the job description from the draft */
export function PermanentJobDescriptionStep({
  data,
  onChange,
  showValidation = false,
  jobId,
}: PermanentJobStepProps) {
  const descriptionError = showValidation
    ? getPermanentStep6FieldError(data, "jobDescription")
    : null;

  const { canGenerate, isGenerating, generate } = useGenerateJobDescription({
    jobId,
    onJobDescriptionChange: (value) => onChange("jobDescription", value),
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Job description
        </h2>
        <p className="text-sm text-muted-foreground">
          Write your own description or generate one from the draft details you
          already saved.
        </p>
      </div>

      <Field data-invalid={Boolean(descriptionError) || undefined}>
        <div className="flex flex-row items-center justify-between gap-2">
          <RequiredFieldLabel htmlFor="permanent-job-description">
            Job description
          </RequiredFieldLabel>
          <Badge
            asChild
            variant="soft"
            className={cn(
              "h-6 cursor-pointer gap-1 px-2.5 text-xs font-semibold",
              (!canGenerate || isGenerating) &&
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
          id="permanent-job-description"
          rows={8}
          value={data.jobDescription}
          placeholder="Describe the role, responsibilities, and ideal candidate…"
          className="max-h-80"
          disabled={isGenerating}
          aria-invalid={Boolean(descriptionError) || undefined}
          onChange={(event) => onChange("jobDescription", event.target.value)}
        />
        <RefineJobDescriptionBadge
          jobDescription={data.jobDescription}
          onJobDescriptionChange={(value) => onChange("jobDescription", value)}
          hidden={isGenerating}
        />
        <FieldError>{descriptionError}</FieldError>
      </Field>
    </div>
  );
}
