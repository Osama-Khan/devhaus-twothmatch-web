import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Clock01Icon,
  Hospital02Icon,
  Location01Icon,
  MoneyBag02Icon,
} from "@hugeicons/core-free-icons";
import type { ProfilePreviewModel } from "@/features/onboarding/utils/build-profile-preview";
import { cn } from "@/lib/utils";

type ProfilePreviewCardProps = {
  preview: ProfilePreviewModel;
  className?: string;
};

const META_ICONS = [
  Location01Icon,
  Hospital02Icon,
  Clock01Icon,
  Briefcase07Icon,
  MoneyBag02Icon,
] as const;

/** Candidate-facing profile preview card built from onboarding data */
export function ProfilePreviewCard({
  preview,
  className,
}: ProfilePreviewCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <h2 className="text-xl font-semibold text-foreground">
        {preview.practiceName}
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {preview.logoInitial}
        </div>
        <p className="text-sm text-muted-foreground">
          {preview.practiceName}, {preview.locationSummary}
        </p>
      </div>

      {preview.requirements.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-foreground">
            Requirements:
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {preview.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {preview.meta.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {preview.meta.map((item, index) => {
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
    </article>
  );
}
