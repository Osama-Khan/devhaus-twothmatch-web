import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Clock01Icon,
  Location01Icon,
  MoneyBag02Icon,
  PinLocation03Icon,
} from "@hugeicons/core-free-icons";
import { IconTextRow } from "@/features/home/components/icon-text-row";
import { CandidateDetailsSidebarSkeleton } from "@/features/home/components/candidate-details-sidebar-skeleton";
import { CandidateDetailUpgradePrompt } from "@/features/home/components/candidate-detail-upgrade-prompt";
import type { CandidateDetailResponse } from "@/features/candidates/types/candidate-detail";
import {
  formatLabelValue,
  formatPayRange,
} from "@/features/candidates/utils/format-candidate-display";
import { cn } from "@/lib/utils";

type CandidateDetailsSidebarProps = {
  detail: CandidateDetailResponse | null;
  isLoading?: boolean;
  error?: string | null;
  /** When true, show the upgrade prompt instead of a red error */
  isPaymentRequired?: boolean;
  className?: string;
};

/** Right column candidate detail panel with job preferences and related info */
export function CandidateDetailsSidebar({
  detail,
  isLoading,
  error,
  isPaymentRequired,
  className,
}: CandidateDetailsSidebarProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-foreground">
        Candidate Details
      </h2>

      {isLoading ? (
        <CandidateDetailsSidebarSkeleton />
      ) : isPaymentRequired ? (
        <div className="mt-5">
          <CandidateDetailUpgradePrompt className="border-0 bg-transparent p-0 shadow-none" />
        </div>
      ) : error ? (
        <SidebarBody message={error} isError />
      ) : detail ? (
        <CandidateDetailsContent detail={detail} />
      ) : (
        <SidebarBody message="Select a candidate to view job preferences and availability." />
      )}
    </aside>
  );
}

type SidebarBodyProps = {
  message: string;
  isError?: boolean;
};

function SidebarBody({ message, isError }: SidebarBodyProps) {
  return (
    <p
      className={cn(
        "mt-5 text-sm",
        isError ? "text-destructive" : "text-muted-foreground"
      )}
    >
      {message}
    </p>
  );
}

function CandidateDetailsContent({
  detail,
}: {
  detail: CandidateDetailResponse;
}) {
  const prefs = detail.jobPreferences;
  const skillNames = detail.skills.map((item) => item.Skill.name);
  const specializationNames = detail.specializations.map(
    (item) => item.Specialization.name
  );

  return (
    <div className="mt-5 space-y-5">
      {prefs ? (
        <section className="rounded-xl bg-muted/60 p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Job Preferences
          </h3>
          <div className="mt-3 space-y-3">
            <IconTextRow
              icon={Briefcase07Icon}
              label="Ideal role"
              value={prefs.idealJobTitle}
            />
            <IconTextRow
              icon={Briefcase07Icon}
              label="Looking for"
              value={formatLabelValue(prefs.lookingFor)}
            />
            <IconTextRow
              icon={Clock01Icon}
              label="Job type"
              value={prefs.jobType}
            />
            <IconTextRow
              icon={Clock01Icon}
              label="Working pattern"
              value={formatLabelValue(prefs.workingPattern)}
            />
            <IconTextRow
              icon={MoneyBag02Icon}
              label="Pay"
              value={formatPayRange({
                hourlyRate: prefs.hourlyRate,
                payMin: prefs.payMin,
                payMax: prefs.payMax,
                salaryPreference: prefs.salaryPreference,
                isNegotiable: prefs.isNegotiable,
              })}
            />
            {prefs.currentAddress && (
              <IconTextRow
                icon={Location01Icon}
                label="Location"
                value={prefs.currentAddress}
              />
            )}
            <IconTextRow
              icon={PinLocation03Icon}
              label="Search radius"
              value={`${prefs.searchRadiusKm} km`}
            />
          </div>
        </section>
      ) : null}

      {skillNames.length > 0 ? (
        <TagSection title="Skills" items={skillNames} />
      ) : null}

      {specializationNames.length > 0 ? (
        <TagSection title="Specializations" items={specializationNames} />
      ) : null}

      {detail.workExperiences.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-foreground">Experience</h3>
          <ul className="mt-3 space-y-3">
            {detail.workExperiences.map((experience) => (
              <li
                key={experience.id}
                className="rounded-xl border border-border bg-background p-3"
              >
                <p className="text-sm font-semibold text-foreground">
                  {experience.roleTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {experience.company}
                  {experience.isCurrent ? " · Current" : ""}
                </p>
                {experience.yearsExperience ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {experience.yearsExperience} years experience
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

type TagSectionProps = {
  title: string;
  items: string[];
};

function TagSection({ title, items }: TagSectionProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
