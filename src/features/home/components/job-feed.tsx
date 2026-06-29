"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/features/home/components/job-card";
import { JobFeedTabs } from "@/features/home/components/job-feed-tabs";
import type { JobFeedTab, JobListing } from "@/features/home/mock/home-mock-data";
import { cn } from "@/lib/utils";

type JobFeedProps = {
  jobs: JobListing[];
  selectedJobId: string;
  onSelectJob: (jobId: string) => void;
  className?: string;
};

/** Center column job feed with tab switcher and listing cards */
export function JobFeed({
  jobs,
  selectedJobId,
  onSelectJob,
  className,
}: JobFeedProps) {
  const [activeTab, setActiveTab] = useState<JobFeedTab>("locum");

  return (
    <section className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-center justify-between gap-4">
        <JobFeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <Button variant="outline" size="icon" type="button" aria-label="Filter jobs">
          <HugeiconsIcon icon={FilterIcon} strokeWidth={2} />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSelected={job.id === selectedJobId}
            onSelect={() => onSelectJob(job.id)}
          />
        ))}
      </div>
    </section>
  );
}
