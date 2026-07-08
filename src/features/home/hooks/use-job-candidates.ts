"use client";

import { useEffect, useState } from "react";
import type { JobFeedTab, JobListing } from "@/features/home/types/job-listing";
import { jobsService } from "@/features/home/services/jobs-service";
import { mapCandidatesToJobListings } from "@/features/home/utils/map-candidate-to-job-listing";
import { isSuccessResponse } from "@/lib/types/response";

const PAGE_SIZE = 10;

type UseJobCandidatesResult = {
  jobs: JobListing[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Fetches locum or permanent candidate listings for the home job feed.
 */
export function useJobCandidates(activeTab: JobFeedTab): UseJobCandidatesResult {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    const params = { page: 1, limit: PAGE_SIZE };

    if (activeTab === "locum") {
      void jobsService.browseLocumCandidates(params).then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setJobs(
            mapCandidatesToJobListings("locum", response.data.candidates)
          );
        } else {
          setJobs([]);
          setError(response.error);
        }

        setIsLoading(false);
      });
    } else {
      void jobsService.browsePermanentCandidates(params).then((response) => {
        if (cancelled) {
          return;
        }

        if (isSuccessResponse(response)) {
          setJobs(
            mapCandidatesToJobListings("permanent", response.data.candidates)
          );
        } else {
          setJobs([]);
          setError(response.error);
        }

        setIsLoading(false);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  return { jobs, isLoading, error };
}
