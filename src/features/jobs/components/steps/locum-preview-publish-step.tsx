"use client";

import { useMemo } from "react";
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
import { useConfigByType } from "@/features/config/hooks/use-config-by-type";
import { ConfigType } from "@/features/config/types/config-type";
import { BooleanSwitchField } from "@/features/jobs/components/job-form-fields";
import { usePracticeLocations } from "@/features/jobs/hooks/use-practice-locations";
import type { LocumJobStepProps } from "@/features/jobs/types/locum-job-form";
import { formatJobPostedDate } from "@/features/jobs/utils/format-job-display";
import {
  formatLocumFormRate,
  formatRateIntervalLabel,
  formatTime12h,
} from "@/features/jobs/utils/format-locum-preview";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

type LocumPreviewPublishStepProps = LocumJobStepProps & {
  className?: string;
};

function useIdNameMap(type: ConfigType): Map<string, string> {
  const { items } = useConfigByType(type);
  return useMemo(
    () => new Map(items.map((item) => [item.id, item.name])),
    [items]
  );
}

/** Step 6 — listing preview and urgent-fill boost toggle */
export function LocumPreviewPublishStep({
  data,
  onChange,
  className,
}: LocumPreviewPublishStepProps) {
  const { user } = useAuthSelector();
  const { locations } = usePracticeLocations();
  const roleNames = useIdNameMap(ConfigType.JOB_TITLES);
  const skillNames = useIdNameMap(ConfigType.SKILLS_REQUIRED);
  const softwareNames = useIdNameMap(ConfigType.SOFTWARE_REQUIRED);
  const specialismNames = useIdNameMap(ConfigType.SPECIALISMS);

  const practiceName = user?.fullName?.trim() || "Your practice";
  const practiceAvatar = user?.avatarUrl;
  const location = locations.find((item) => item.id === data.locationId);
  const locationLabel = location?.address?.trim() || null;

  const title = roleNames.get(data.roleId) || "Untitled shift";
  const practiceLine = locationLabel
    ? `${practiceName}, ${locationLabel}`
    : practiceName;

  const requirements = [
    ...data.skills.map((id) => skillNames.get(id)).filter(Boolean),
    ...data.software.map((id) => softwareNames.get(id)).filter(Boolean),
    ...data.specialisms.map((id) => specialismNames.get(id)).filter(Boolean),
  ] as string[];

  const timeRange =
    data.timeStart && data.timeEnd
      ? `${formatTime12h(data.timeStart)} – ${formatTime12h(data.timeEnd)}`
      : "—";

  const metaItems = [
    {
      key: "location",
      icon: Location01Icon,
      value: locationLabel ?? "Location not set",
    },
    {
      key: "time",
      icon: Clock01Icon,
      value: timeRange,
    },
    {
      key: "date",
      icon: Calendar03Icon,
      value: data.date
        ? formatJobPostedDate(`${data.date}T12:00:00`)
        : "Date not set",
    },
    {
      key: "interval",
      icon: Briefcase07Icon,
      value: formatRateIntervalLabel(data.rateInterval),
    },
    {
      key: "rate",
      icon: MoneyBag02Icon,
      value: formatLocumFormRate(data),
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
          {formatLocumFormRate(data)}
        </p>

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
        id="locum-boost-urgent"
        label="Boost this Job Urgent Fill"
        description="Mark this shift as urgent so it stands out to candidates."
        checked={data.boostUrgentFill}
        onCheckedChange={(checked) => onChange("boostUrgentFill", checked)}
      />
    </div>
  );
}
