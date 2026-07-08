import { CandidateProfileCard } from "@/features/home/components/candidate-profile-card";
import { CandidateProfileCardSkeleton } from "@/features/home/components/candidate-profile-card-skeleton";
import type { CandidateProfile } from "@/features/candidates/types/candidate-detail";
import { cn } from "@/lib/utils";

type CandidateProfileSidebarProps = {
  profile: CandidateProfile | null;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
};

/** Left column: selected candidate profile summary */
export function CandidateProfileSidebar({
  profile,
  isLoading,
  error,
  className,
}: CandidateProfileSidebarProps) {
  return (
    <aside className={cn("flex flex-col gap-5", className)}>
      {isLoading ? (
        <CandidateProfileCardSkeleton />
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
