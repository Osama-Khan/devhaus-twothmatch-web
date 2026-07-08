import { HugeiconsIcon } from "@hugeicons/react";
import { Linkedin02Icon } from "@hugeicons/core-free-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { CandidateProfile } from "@/features/candidates/types/candidate-detail";
import {
  formatLabelValue,
  getInitials,
} from "@/features/candidates/utils/format-candidate-display";
import { cn } from "@/lib/utils";

type CandidateProfileCardProps = {
  profile: CandidateProfile;
  className?: string;
};

/** Left sidebar candidate profile card with avatar and basic details */
export function CandidateProfileCard({
  profile,
  className,
}: CandidateProfileCardProps) {
  const initials = getInitials(profile.fullName);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
        <Avatar className="size-24" size="lg">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar} alt={profile.fullName} />
          ) : null}
          <AvatarFallback className="text-xl font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-3">
          {profile.linkedinUrl ? (
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0a66c2] transition-opacity hover:opacity-90"
              aria-label={`${profile.fullName} on LinkedIn`}
            >
              <HugeiconsIcon
                icon={Linkedin02Icon}
                strokeWidth={2}
                className="size-4 text-white"
              />
            </a>
          ) : null}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                {profile.fullName}
              </h2>
              {profile.isVerified ? (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  Verified
                </span>
              ) : null}
            </div>
            <p className="text-sm font-medium text-primary">{profile.jobTitle}</p>
            {profile.currentStatus ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {formatLabelValue(profile.currentStatus)}
              </p>
            ) : null}
          </div>
        </div>

        {profile.aboutMe ? (
          <div className="rounded-xl bg-muted/60 p-4">
            <h3 className="text-sm font-semibold text-foreground">About Me</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {profile.aboutMe}
            </p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
