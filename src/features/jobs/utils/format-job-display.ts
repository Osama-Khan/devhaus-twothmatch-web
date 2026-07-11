import type { JobListItem } from "@/features/jobs/types";

/** Format a job list rate for display (locum amount/interval or permanent salary range) */
export function formatJobListRate(job: JobListItem): string {
  if (job.type === "locum") {
    const amount = Number.parseFloat(job.rate.amount);
    const suffix = job.rate.interval === "hour" ? "/hr" : `/${job.rate.interval}`;

    if (!Number.isNaN(amount)) {
      return `£${amount}${suffix}`;
    }

    return `£${job.rate.amount}${suffix}`;
  }

  const range = job.rate.salaryRange.trim();
  if (/^\d+(\.\d+)?\s*-\s*\d+(\.\d+)?$/.test(range)) {
    const [min, max] = range.split("-").map((part) => part.trim());
    return `£${Number(min).toLocaleString("en-GB")} - £${Number(max).toLocaleString("en-GB")}`;
  }

  return range.startsWith("£") ? range : `£${range}`;
}

/** Format a job `createdAt` as e.g. `24 Apr 2025` */
export function formatJobPostedDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}

/** Capitalize job status for button labels */
export function formatJobStatusLabel(status: string): string {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
