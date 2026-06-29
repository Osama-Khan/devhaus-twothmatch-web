import { HugeiconsIcon } from "@hugeicons/react";
import { Linkedin02Icon, Location01Icon } from "@hugeicons/core-free-icons";
import type { ProfileSummary } from "@/features/home/mock/home-mock-data";
import { cn } from "@/lib/utils";

type ProfileCardProps = {
  profile: ProfileSummary;
  className?: string;
};

/** Left sidebar practice profile card */
export function ProfileCard({ profile, className }: ProfileCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-[#1e6fd9]">
        <div className="text-center">
          <p className="text-lg font-bold tracking-tight text-white">
            Smile Bright
          </p>
          <p className="text-sm font-semibold text-[#f5d547]">Dental</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0a66c2]">
            <HugeiconsIcon
              icon={Linkedin02Icon}
              strokeWidth={2}
              className="size-4 text-white"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground">
              {profile.practiceName}
            </h2>
            <p className="text-sm font-medium text-primary">
              {profile.practiceType}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <HugeiconsIcon
                icon={Location01Icon}
                strokeWidth={2}
                className="size-3.5 shrink-0"
              />
              <span>{profile.distance}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-muted/60 p-4">
          <h3 className="text-sm font-semibold text-foreground">About Me</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {profile.about}
          </p>
        </div>
      </div>
    </article>
  );
}
