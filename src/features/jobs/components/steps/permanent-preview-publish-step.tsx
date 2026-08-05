"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/features/candidates/utils/format-candidate-display";
import { ConfigType } from "@/features/config/types/config-type";
import { BooleanSwitchField } from "@/features/jobs/components/job-form-fields";
import { useConfigIdNameMap } from "@/features/jobs/hooks/use-config-id-name-map";
import { usePracticeLocations } from "@/features/jobs/hooks/use-practice-locations";
import type { PermanentJobStepProps } from "@/features/jobs/types/permanent-job-form";
import { formatJobPostedDate } from "@/features/jobs/utils/format-job-display";
import { formatTime12h } from "@/features/jobs/utils/format-locum-preview";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

type PermanentPreviewPublishStepProps = PermanentJobStepProps & {
  className?: string;
};

function formatAnnualSalary(salaryRange: string): string {
  const amount = Number.parseFloat(salaryRange);
  if (!Number.isFinite(amount)) {
    return salaryRange ? `£${salaryRange}` : "—";
  }
  return `£${amount.toLocaleString("en-GB")}`;
}

/** Step 7 — listing preview and boost toggle */
export function PermanentPreviewPublishStep({
  data,
  onChange,
  className,
}: PermanentPreviewPublishStepProps) {
  const { user } = useAuthSelector();
  const { locations } = usePracticeLocations();
  const jobTypeNames = useConfigIdNameMap(ConfigType.JOB_CREATION_JOB_TYPES);
  const skillNames = useConfigIdNameMap(ConfigType.SKILLS_REQUIRED);
  const softwareNames = useConfigIdNameMap(ConfigType.SOFTWARE_REQUIRED);
  const specialismNames = useConfigIdNameMap(ConfigType.SPECIALISMS);
  const experienceNames = useConfigIdNameMap(ConfigType.EXPERIENCE_LEVELS);

  const practiceName = user?.fullName?.trim() || "Your practice";
  const practiceAvatar = user?.avatarUrl;
  const location = locations.find((item) => item.id === data.locationId);
  const locationLabel = location?.address?.trim() || null;

  const title = data.jobTitle.trim() || "Untitled job";
  const practiceLine = locationLabel
    ? `${practiceName}, ${locationLabel}`
    : practiceName;

  const requirements = [
    ...data.skills.map((id) => skillNames.get(id)).filter(Boolean),
    ...data.software.map((id) => softwareNames.get(id)).filter(Boolean),
    ...data.experienceLevels
      .map((id) => experienceNames.get(id))
      .filter(Boolean),
    ...data.specialisms.map((id) => specialismNames.get(id)).filter(Boolean),
  ] as string[];

  const timeRange =
    data.workingHoursStart && data.workingHoursEnd
      ? `${formatTime12h(data.workingHoursStart)} – ${formatTime12h(data.workingHoursEnd)}`
      : "—";

  const metaItems = [
    {
      key: "location",
      icon: Location01Icon,
      value: locationLabel ?? "Location not set",
    },
    {
      key: "hours",
      icon: Clock01Icon,
      value: timeRange,
    },
    {
      key: "start",
      icon: Calendar03Icon,
      value: data.startDate
        ? formatJobPostedDate(`${data.startDate}T12:00:00`)
        : "Start date not set",
    },
    {
      key: "job-type",
      icon: Briefcase07Icon,
      value: jobTypeNames.get(data.jobTypeId) || "Job type not set",
    },
    {
      key: "salary",
      icon: MoneyBag02Icon,
      value: formatAnnualSalary(data.salaryRange),
    },
  ];

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <h2 className="text-lg font-semibold text-foreground">
        Preview & Publish
      </h2>

      <article className="rounded-3xl border border-border bg-card p-5">
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>

        <div className="mt-3 flex items-center gap-2.5">
          <Avatar>
            {practiceAvatar ? (
              <AvatarImage src={practiceAvatar} alt={practiceName} />
            ) : null}
            <AvatarFallback>{getInitials(practiceName)}</AvatarFallback>
          </Avatar>
          <p className="min-w-0 truncate text-sm text-muted-foreground">
            {practiceLine}
          </p>
        </div>

        <p className="mt-4 text-2xl font-semibold text-primary">
          {formatAnnualSalary(data.salaryRange)}
        </p>

        {data.jobDescription.trim() ? (
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
            {data.jobDescription.trim()}
          </p>
        ) : null}

        {requirements.length > 0 ? (
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground">
              Requirements:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {requirements.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-4">
          {metaItems.map((item) => (
            <div key={item.key} className="flex gap-2">
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <p className="min-w-0 text-sm font-medium text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </article>

      <BooleanSwitchField
        id="permanent-boost-listing"
        label="Boost this Job Urgent Fill"
        description="Boost this listing so it stands out to candidates."
        checked={data.boostListing}
        onCheckedChange={(checked) => onChange("boostListing", checked)}
      />
    </div>
  );
}
