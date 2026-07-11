"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase07Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JobListingCard } from "@/features/jobs/components/job-listing-card";
import { JobListingCardSkeleton } from "@/features/jobs/components/job-listing-card-skeleton";
import { useJobs } from "@/features/jobs/hooks/use-jobs";
import { useAuthSelector } from "@/lib/store/hooks";
import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type MyJobsViewProps = {
  className?: string;
};

/** Authenticated practice job listings page */
export function MyJobsView({ className }: MyJobsViewProps) {
  const { user } = useAuthSelector();
  const { jobs, isLoading, isLoadingMore, error, hasMore, loadMore, refetch } =
    useJobs();

  const practiceName = user?.fullName?.trim() || "Your practice";
  const practice = {
    name: practiceName,
    avatarUrl: user?.avatarUrl,
  };

  return (
    <main className={cn("flex h-full min-h-0 w-full flex-col", className)}>
      <ScrollArea className="h-full w-full">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              My Jobs
            </h1>
            <Button type="button" variant="default" asChild>
              <Link href={appRoutes.nav.myJobs.create._self.path}>
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  className="size-4"
                />
                Post a Job
              </Link>
            </Button>
          </div>

          <section className="mt-6">
            {isLoading ? (
              <JobListingCardSkeleton />
            ) : error && jobs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12">
                <p className="text-center text-sm text-destructive">{error}</p>
                <Button type="button" variant="outline" onClick={refetch}>
                  Try again
                </Button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12">
                <HugeiconsIcon
                  icon={Briefcase07Icon}
                  strokeWidth={2}
                  className="size-14 text-primary"
                />
                <p className="text-center text-base font-medium text-muted-foreground">
                  No jobs posted yet.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {jobs.map((job) => (
                  <JobListingCard key={job.id} job={job} practice={practice} />
                ))}

                {error ? (
                  <p className="text-center text-sm text-destructive">
                    {error}
                  </p>
                ) : null}

                {hasMore ? (
                  <div className="flex justify-center pt-2">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto py-0 text-sm font-semibold"
                      disabled={isLoadingMore}
                      onClick={loadMore}
                    >
                      {isLoadingMore ? "Loading…" : "Load more"}
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </ScrollArea>
    </main>
  );
}
