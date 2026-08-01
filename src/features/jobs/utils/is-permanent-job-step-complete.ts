import type { PermanentJobFormData } from "@/features/jobs/types/permanent-job-form";
import {
  permanentStep1Schema,
  permanentStep2Schema,
  permanentStep3Schema,
  permanentStep4Schema,
  permanentStep5Schema,
} from "@/features/jobs/form/permanent-job-step-schemas";

/** Whether the current permanent create step has required fields filled and valid */
export function isPermanentJobStepComplete(
  step: number,
  data: PermanentJobFormData
): boolean {
  switch (step) {
    case 1:
      return permanentStep1Schema.safeParse({
        roleId: data.roleId,
        locationId: data.locationId,
        contractTypeId: data.contractTypeId,
        jobTypeId: data.jobTypeId,
        startDate: data.startDate,
      }).success;
    case 2:
      return permanentStep2Schema.safeParse({
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        useAiJd: data.useAiJd,
        skills: data.skills,
        software: data.software,
        experienceLevels: data.experienceLevels,
        specialisms: data.specialisms,
      }).success;
    case 3:
      return permanentStep3Schema.safeParse({
        salaryRange: data.salaryRange,
        benefits: data.benefits,
        workingHoursStart: data.workingHoursStart,
        workingHoursEnd: data.workingHoursEnd,
        isWorkingHoursFlexible: data.isWorkingHoursFlexible,
      }).success;
    case 4:
      return permanentStep4Schema.safeParse({
        complianceDocuments: data.complianceDocuments,
        autoFilterValidDocs: data.autoFilterValidDocs,
      }).success;
    case 5:
      return permanentStep5Schema.safeParse({
        interviewTypeId: data.interviewTypeId,
      }).success;
    case 6:
      return true;
    default:
      return false;
  }
}
