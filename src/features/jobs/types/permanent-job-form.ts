import type {
  PermanentJobFields,
  UpdateJobRequest,
} from "@/features/jobs/types/job-requests";

/** Client form state for the permanent create wizard */
export type PermanentJobFormData = {
  roleId: string;
  locationId: string;
  contractTypeId: string;
  jobTypeId: string;
  startDate: string;
  jobTitle: string;
  jobDescription: string;
  skills: string[];
  software: string[];
  experienceLevels: string[];
  specialisms: string[];
  salaryRange: string;
  benefits: string[];
  workingHoursStart: string;
  workingHoursEnd: string;
  isWorkingHoursFlexible: boolean;
  complianceDocuments: string[];
  autoFilterValidDocs: boolean;
  interviewTypeId: string;
  boostListing: boolean;
};

export type PermanentJobStepProps = {
  data: PermanentJobFormData;
  onChange: <K extends keyof PermanentJobFormData>(
    field: K,
    value: PermanentJobFormData[K]
  ) => void;
  showValidation?: boolean;
  /** Draft job id once created — used for AI generate-jd */
  jobId?: string | null;
};

/** Initial empty permanent create form */
export function createInitialPermanentJobFormData(): PermanentJobFormData {
  return {
    roleId: "",
    locationId: "",
    contractTypeId: "",
    jobTypeId: "",
    startDate: "",
    jobTitle: "",
    jobDescription: "",
    skills: [],
    software: [],
    experienceLevels: [],
    specialisms: [],
    salaryRange: "",
    benefits: [],
    workingHoursStart: "",
    workingHoursEnd: "",
    isWorkingHoursFlexible: false,
    complianceDocuments: [],
    autoFilterValidDocs: false,
    interviewTypeId: "",
    boostListing: false,
  };
}

/** Permanent step 1 fields (basics). */
export function buildPermanentStep1Fields(
  data: PermanentJobFormData
): Pick<
  PermanentJobFields,
  "roleId" | "locationId" | "contractTypeId" | "jobTypeId" | "startDate"
> {
  return {
    roleId: data.roleId || undefined,
    locationId: data.locationId || undefined,
    contractTypeId: data.contractTypeId || undefined,
    jobTypeId: data.jobTypeId || undefined,
    startDate: data.startDate || undefined,
  };
}

/** Permanent step 2 fields (title + requirements — no JD). */
export function buildPermanentStep2Fields(
  data: PermanentJobFormData
): Pick<
  PermanentJobFields,
  "jobTitle" | "skills" | "software" | "experienceLevels" | "specialisms"
> {
  return {
    jobTitle: data.jobTitle.trim() || undefined,
    skills: data.skills,
    software: data.software,
    experienceLevels: data.experienceLevels,
    specialisms: data.specialisms,
  };
}

/** Permanent step 3 fields (salary / benefits). */
export function buildPermanentStep3Fields(
  data: PermanentJobFormData
): Pick<
  PermanentJobFields,
  | "salaryRange"
  | "benefits"
  | "workingHoursStart"
  | "workingHoursEnd"
  | "isWorkingHoursFlexible"
> {
  return {
    salaryRange: data.salaryRange.trim() || undefined,
    benefits: data.benefits,
    workingHoursStart: data.workingHoursStart || undefined,
    workingHoursEnd: data.workingHoursEnd || undefined,
    isWorkingHoursFlexible: data.isWorkingHoursFlexible,
  };
}

/** Permanent step 4 fields (compliance). */
export function buildPermanentStep4Fields(
  data: PermanentJobFormData
): Pick<PermanentJobFields, "complianceDocuments" | "autoFilterValidDocs"> {
  return {
    complianceDocuments: data.complianceDocuments,
    autoFilterValidDocs: data.autoFilterValidDocs,
  };
}

/** Permanent step 5 fields (interview). */
export function buildPermanentStep5Fields(
  data: PermanentJobFormData
): Pick<PermanentJobFields, "interviewTypeId"> {
  return {
    interviewTypeId: data.interviewTypeId || undefined,
  };
}

/** Permanent step 6 fields (job description). */
export function buildPermanentStep6Fields(
  data: PermanentJobFormData
): Pick<PermanentJobFields, "jobDescription"> {
  return {
    jobDescription: data.jobDescription.trim() || undefined,
  };
}

/** Permanent step 7 preview fields (boost applied on publish). */
export function buildPermanentStep7Fields(
  data: PermanentJobFormData,
  options: { includeBoost?: boolean } = {}
): Pick<PermanentJobFields, "boostListing"> {
  if (options.includeBoost) {
    return { boostListing: data.boostListing };
  }
  return {};
}

/**
 * Partial fields for a permanent wizard step (no `isDraft` / `status`).
 */
export function buildPermanentStepFields(
  step: number,
  data: PermanentJobFormData
): PermanentJobFields {
  switch (step) {
    case 1:
      return buildPermanentStep1Fields(data);
    case 2:
      return buildPermanentStep2Fields(data);
    case 3:
      return buildPermanentStep3Fields(data);
    case 4:
      return buildPermanentStep4Fields(data);
    case 5:
      return buildPermanentStep5Fields(data);
    case 6:
      return buildPermanentStep6Fields(data);
    case 7:
      return buildPermanentStep7Fields(data);
    default:
      return {};
  }
}

/**
 * POST body for creating a permanent draft from step 1.
 */
export function buildCreatePermanentDraftRequest(
  data: PermanentJobFormData
): PermanentJobFields & { type: "permanent"; isDraft: true } {
  return {
    type: "permanent",
    isDraft: true,
    ...buildPermanentStep1Fields(data),
  };
}

/**
 * PATCH body to publish an existing permanent draft.
 */
export function buildPublishPermanentJobRequest(
  jobId: string,
  data: PermanentJobFormData
): UpdateJobRequest {
  return {
    id: jobId,
    type: "permanent",
    isDraft: false,
    ...buildPermanentStep1Fields(data),
    ...buildPermanentStep2Fields(data),
    ...buildPermanentStep3Fields(data),
    ...buildPermanentStep4Fields(data),
    ...buildPermanentStep5Fields(data),
    ...buildPermanentStep6Fields(data),
    ...buildPermanentStep7Fields(data, { includeBoost: true }),
    status: "active",
  };
}

/** Maps form state to the create-job API body (full publish create). */
export function buildCreatePermanentJobRequest(
  data: PermanentJobFormData
): PermanentJobFields & { type: "permanent"; isDraft: false } {
  return {
    type: "permanent",
    isDraft: false,
    ...buildPermanentStep1Fields(data),
    ...buildPermanentStep2Fields(data),
    ...buildPermanentStep3Fields(data),
    ...buildPermanentStep4Fields(data),
    ...buildPermanentStep5Fields(data),
    ...buildPermanentStep6Fields(data),
    ...buildPermanentStep7Fields(data, { includeBoost: true }),
    status: "active",
  };
}
