import type {
  JobDetailTag,
  JobListItem,
  LocumJob,
  LocumJobDetail,
  LocumJobListItem,
  PermanentJob,
  PermanentJobDetail,
  PermanentJobListItem,
} from "@/features/jobs/types/job";
import {
  createInitialLocumJobFormData,
  type LocumJobFormData,
} from "@/features/jobs/types/locum-job-form";
import {
  createInitialPermanentJobFormData,
  type PermanentJobFormData,
} from "@/features/jobs/types/permanent-job-form";
import { isLocumJobStepComplete } from "@/features/jobs/utils/is-locum-job-step-complete";
import { isPermanentJobStepComplete } from "@/features/jobs/utils/is-permanent-job-step-complete";
import type { JobRateInterval } from "@/features/jobs/types/job-requests";

function asString(value: string | null | undefined): string {
  return value ?? "";
}

function asStringArray(value: string[] | null | undefined): string[] {
  return Array.isArray(value) ? value : [];
}

function asBoolean(value: boolean | null | undefined): boolean {
  return Boolean(value);
}

/** Normalize `HH:MM:SS` / `HH:MM` times for time inputs. */
function normalizeTime(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  const trimmed = value.trim();
  return trimmed.length >= 5 ? trimmed.slice(0, 5) : trimmed;
}

/**
 * Extract config/form ids from shaped detail tags (`{ id, name }` or raw strings).
 */
export function toJobDetailIds(
  tags: JobDetailTag[] | null | undefined
): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => {
      if (typeof tag === "string") {
        return tag;
      }
      if (tag && typeof tag === "object" && typeof tag.id === "string") {
        return tag.id;
      }
      return "";
    })
    .filter(Boolean);
}

/**
 * Maps a locum create/update entity into wizard form state.
 */
export function mapLocumJobToFormData(job: LocumJob): LocumJobFormData {
  const data = createInitialLocumJobFormData();
  data.roleId = asString(job.roleId);
  data.locationId = asString(job.locationId);
  data.date = asString(job.date);
  data.timeStart = normalizeTime(job.timeStart);
  data.timeEnd = normalizeTime(job.timeEnd);
  data.breakDurationMins = job.breakDurationMins ?? 0;
  data.rate = job.rate != null ? String(job.rate) : "";
  data.rateInterval = (job.rateInterval as JobRateInterval) || "";
  data.isOvertimePaid = asBoolean(job.isOvertimePaid);
  data.paymentTermsId = asString(job.paymentTermsId);
  data.cancellationPolicyId = asString(job.cancellationPolicyId);
  data.skills = asStringArray(job.skills);
  data.software = asStringArray(job.software);
  data.specialisms = asStringArray(job.specialisms);
  data.ppeProvided = asBoolean(job.ppeProvided);
  data.isParkingAvailable = asBoolean(job.isParkingAvailable);
  data.isPublicTransportAvailable = asBoolean(job.isPublicTransportAvailable);
  data.boostUrgentFill = job.status === "urgent";
  return data;
}

/**
 * Maps a permanent create/update entity into wizard form state.
 */
export function mapPermanentJobToFormData(
  job: PermanentJob
): PermanentJobFormData {
  const data = createInitialPermanentJobFormData();
  data.roleId = asString(job.roleId);
  data.locationId = asString(job.locationId);
  data.contractTypeId = asString(job.contractTypeId);
  data.jobTypeId = asString(job.jobTypeId);
  data.interviewTypeId = asString(job.interviewTypeId);
  data.startDate = asString(job.startDate);
  data.jobTitle = asString(job.jobTitle);
  data.jobDescription = asString(job.jobDescription);
  data.workingHoursStart = normalizeTime(job.workingHoursStart);
  data.workingHoursEnd = normalizeTime(job.workingHoursEnd);
  data.isWorkingHoursFlexible = asBoolean(job.isWorkingHoursFlexible);
  data.skills = asStringArray(job.skills);
  data.software = asStringArray(job.software);
  data.experienceLevels = asStringArray(job.experienceLevels);
  data.specialisms = asStringArray(job.specialisms);
  data.salaryRange = asString(job.salaryRange);
  data.benefits = asStringArray(job.benefits);
  data.complianceDocuments = asStringArray(job.complianceDocuments);
  data.boostListing = asBoolean(job.boostListing);
  return data;
}

/**
 * Maps GET `/jobs/:id` locum detail into wizard form state.
 */
export function mapLocumJobDetailToFormData(
  job: LocumJobDetail
): LocumJobFormData {
  const data = createInitialLocumJobFormData();
  data.roleId = job.role?.id ?? "";
  data.locationId = job.location?.id ?? "";
  data.date = job.date ?? "";
  data.timeStart = normalizeTime(job.timeStart);
  data.timeEnd = normalizeTime(job.timeEnd);
  data.breakDurationMins = job.breakDurationMins ?? 0;
  data.rate = job.rate?.amount ?? "";
  data.rateInterval = (job.rate?.interval as JobRateInterval) || "";
  data.isOvertimePaid = asBoolean(job.isOvertimePaid);
  data.paymentTermsId = job.paymentTerms?.id ?? "";
  data.cancellationPolicyId = job.cancellationPolicy?.id ?? "";
  data.skills = toJobDetailIds(job.skills);
  data.software = toJobDetailIds(job.software);
  data.specialisms = toJobDetailIds(job.specialisms);
  data.ppeProvided = asBoolean(job.ppeProvided);
  data.isParkingAvailable = asBoolean(job.isParkingAvailable);
  data.isPublicTransportAvailable = asBoolean(job.isPublicTransportAvailable);
  data.autoblockUnverified = asBoolean(job.autoblockUnverified);
  data.mandatoryDocsForBooking = asBoolean(job.mandatoryDocsForBooking);
  data.instantBook = asBoolean(job.instantBook);
  data.approvalRequired = asBoolean(job.approvalRequired);
  data.boostUrgentFill = job.status === "urgent";
  return data;
}

/**
 * Maps GET `/jobs/:id` permanent detail into wizard form state.
 */
export function mapPermanentJobDetailToFormData(
  job: PermanentJobDetail
): PermanentJobFormData {
  const data = createInitialPermanentJobFormData();
  data.roleId = job.role?.id ?? "";
  data.locationId = job.location?.id ?? "";
  data.contractTypeId = job.contractType?.id ?? "";
  data.jobTypeId = job.jobType?.id ?? "";
  data.interviewTypeId = job.interviewType?.id ?? "";
  data.startDate = job.startDate ?? "";
  data.jobTitle = job.jobTitle ?? job.title ?? "";
  data.jobDescription = asString(job.jobDescription);
  data.workingHoursStart = normalizeTime(job.workingHoursStart);
  data.workingHoursEnd = normalizeTime(job.workingHoursEnd);
  data.isWorkingHoursFlexible = asBoolean(job.isWorkingHoursFlexible);
  data.skills = toJobDetailIds(job.skills);
  data.software = toJobDetailIds(job.software);
  data.experienceLevels = toJobDetailIds(job.experienceLevels);
  data.specialisms = toJobDetailIds(job.specialisms);
  data.salaryRange = job.rate?.salaryRange ?? "";
  data.benefits = toJobDetailIds(job.benefits);
  data.complianceDocuments = toJobDetailIds(job.complianceDocuments);
  data.autoFilterValidDocs = asBoolean(job.autoFilterValidDocs);
  data.boostListing = asBoolean(job.boostListing);
  return data;
}

/** @deprecated Prefer {@link mapLocumJobDetailToFormData} via GET `/jobs/:id` */
export function mapLocumListItemToFormData(
  job: LocumJobListItem
): LocumJobFormData {
  return mapLocumJobDetailToFormData(job);
}

/** @deprecated Prefer {@link mapPermanentJobDetailToFormData} via GET `/jobs/:id` */
export function mapPermanentListItemToFormData(
  job: PermanentJobListItem
): PermanentJobFormData {
  return mapPermanentJobDetailToFormData(job);
}

/** First incomplete locum step (1-based), or preview step when all complete. */
export function getFirstIncompleteLocumStep(data: LocumJobFormData): number {
  for (let step = 1; step <= 5; step += 1) {
    if (!isLocumJobStepComplete(step, data)) {
      return step;
    }
  }
  return 6;
}

/** First incomplete permanent step (1-based), or preview step when all complete. */
export function getFirstIncompletePermanentStep(
  data: PermanentJobFormData
): number {
  for (let step = 1; step <= 6; step += 1) {
    if (!isPermanentJobStepComplete(step, data)) {
      return step;
    }
  }
  return 7;
}

/** Type guard for locum list items */
export function isLocumJobListItem(
  job: JobListItem
): job is LocumJobListItem {
  return job.type === "locum";
}

/** Type guard for permanent list items */
export function isPermanentJobListItem(
  job: JobListItem
): job is PermanentJobListItem {
  return job.type === "permanent";
}
