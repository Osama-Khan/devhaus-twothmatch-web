import { CandidateProfileCard } from "@/features/home/components/candidate-profile-card";
import { CandidateProfileCardSkeleton } from "@/features/home/components/candidate-profile-card-skeleton";
import { CandidateDetailUpgradePrompt } from "@/features/home/components/candidate-detail-upgrade-prompt";
import type { CandidateProfile } from "@/features/candidates/types/candidate-detail";
import { cn } from "@/lib/utils";

type CandidateProfileSidebarProps = {
  profile: CandidateProfile | null;
  isLoading?: boolean;
  error?: string | null;
  /** When true, show the upgrade prompt instead of a red error */
  isPaymentRequired?: boolean;
  className?: string;
};

/** Left column: selected candidate profile summary */
export function CandidateProfileSidebar({
  profile,
  isLoading,
  error,
  isPaymentRequired,
  className,
}: CandidateProfileSidebarProps) {
  return (
    <aside className={cn("flex flex-col gap-5", className)}>
      {isLoading ? (
        <CandidateProfileCardSkeleton />
      ) : isPaymentRequired ? (
        <CandidateDetailUpgradePrompt compact />
      ) : error ? (
        <SidebarPlaceholder message={error} isError />
      ) : profile ? (
        <CandidateProfileCard profile={profile} />
      ) : (
        <SidebarPlaceholder message="Select a candidate to view their profile." />
      )}
    </aside>
  );
}

type SidebarPlaceholderProps = {
  message: string;
  isError?: boolean;
};

function SidebarPlaceholder({ message, isError }: SidebarPlaceholderProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <p
        className={cn(
          "text-center text-sm",
          isError ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {message}
      </p>
    </div>
  );
}
