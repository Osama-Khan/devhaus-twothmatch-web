import type { LocumJobFormData } from "@/features/jobs/types/locum-job-form";
import {
  locumStep1Schema,
  locumStep2Schema,
  locumStep3Schema,
  locumStep5Schema,
} from "@/features/jobs/form/locum-job-step-schemas";

/** Whether the current locum create step has required fields filled and valid */
export function isLocumJobStepComplete(
  step: number,
  data: LocumJobFormData
): boolean {
  switch (step) {
    case 1:
      return locumStep1Schema.safeParse({
        roleId: data.roleId,
        locationId: data.locationId,
        date: data.date,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        breakDurationMins: data.breakDurationMins,
      }).success;
    case 2:
      return locumStep2Schema.safeParse({
        rateInterval: data.rateInterval || undefined,
        rate: data.rate,
        isOvertimePaid: data.isOvertimePaid,
        paymentTermsId: data.paymentTermsId,
        cancellationPolicyId: data.cancellationPolicyId,
      }).success;
    case 3:
      return locumStep3Schema.safeParse({
        skills: data.skills,
        software: data.software,
        specialisms: data.specialisms,
        ppeProvided: data.ppeProvided,
        isParkingAvailable: data.isParkingAvailable,
        isPublicTransportAvailable: data.isPublicTransportAvailable,
      }).success;
    case 4:
      return true;
    case 5:
      return locumStep5Schema.safeParse({
        instantBook: data.instantBook,
        approvalRequired: data.approvalRequired,
      }).success;
    case 6:
      return true;
    default:
      return false;
  }
}
