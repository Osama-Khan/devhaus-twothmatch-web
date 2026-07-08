/** Job feed tab options on the home page */
export type JobFeedTab = "locum" | "permanent";

/** Metadata row item on a job card */
export type JobMetaItem = {
  label: string;
  value: string;
};

/** Job listing card in the center feed */
export type JobListing = {
  id: string;
  posterUserId: string;
  isNew: boolean;
  posterName: string;
  posterInitials: string;
  title: string;
  rate: string;
  matchPercent?: number;
  requirements?: string[];
  meta: JobMetaItem[];
};
