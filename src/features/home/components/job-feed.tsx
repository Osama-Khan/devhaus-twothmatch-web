"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/features/home/components/job-card";
import { JobFeedTabs } from "@/features/home/components/job-feed-tabs";
import { useJobCandidates } from "@/features/home/hooks/use-job-candidates";
import type { JobFeedTab } from "@/features/home/types/job-listing";
import { cn } from "@/lib/utils";

type JobFeedProps = {
  selectedCandidateId?: string;
  onSelectCandidate: (candidateId: string | null) => void;
  className?: string;
};

/** Center column job feed with tab switcher and listing cards */
export function JobFeed({
  selectedCandidateId,
  onSelectCandidate,
  className,
}: JobFeedProps) {
  const [activeTab, setActiveTab] = useState<JobFeedTab>("locum");
  const { jobs, isLoading, error } = useJobCandidates(activeTab);

  const handleTabChange = (tab: JobFeedTab) => {
    setActiveTab(tab);
    onSelectCandidate(null);
  };

  return (
    <section className={cn("flex flex-col gap-5 w-full", className)}>
      <div className="flex items-center justify-between gap-4">
        <JobFeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="border-none text-foreground"
          aria-label="Filter jobs"
        >
          <HugeiconsIcon icon={FilterHorizontalIcon} strokeWidth={2} />
        </Button>
      </div>

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Loading jobs…
        </p>
      ) : error ? (
        <p className="py-8 text-center text-sm text-destructive">{error}</p>
      ) : jobs.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No jobs found.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={job.id === selectedCandidateId}
              onSelect={() => onSelectCandidate(job.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
