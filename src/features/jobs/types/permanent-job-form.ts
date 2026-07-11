import type { PermanentJobFields } from "@/features/jobs/types/job-requests";

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

/** Maps form state to the create-job API body */
export function buildCreatePermanentJobRequest(
  data: PermanentJobFormData
): PermanentJobFields & { type: "permanent" } {
  return {
    type: "permanent",
    roleId: data.roleId || undefined,
    locationId: data.locationId || undefined,
    contractTypeId: data.contractTypeId || undefined,
    jobTypeId: data.jobTypeId || undefined,
    interviewTypeId: data.interviewTypeId || undefined,
    startDate: data.startDate || undefined,
    jobTitle: data.jobTitle.trim() || undefined,
    jobDescription: data.jobDescription.trim() || undefined,
    workingHoursStart: data.workingHoursStart || undefined,
    workingHoursEnd: data.workingHoursEnd || undefined,
    isWorkingHoursFlexible: data.isWorkingHoursFlexible,
    skills: data.skills,
    software: data.software,
    experienceLevels: data.experienceLevels,
    specialisms: data.specialisms,
    salaryRange: data.salaryRange.trim() || undefined,
    benefits: data.benefits,
    complianceDocuments: data.complianceDocuments,
    autoFilterValidDocs: data.autoFilterValidDocs,
    boostListing: data.boostListing,
    status: "active",
  };
}
