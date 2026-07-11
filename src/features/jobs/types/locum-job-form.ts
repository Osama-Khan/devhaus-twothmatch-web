import type {
  JobRateInterval,
  LocumJobFields,
} from "@/features/jobs/types/job-requests";

/** Client form state for the locum create wizard */
export type LocumJobFormData = {
  roleId: string;
  locationId: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  /** `0` means no break (sent as `null`) */
  breakDurationMins: number;
  rate: string;
  rateInterval: JobRateInterval | "";
  isOvertimePaid: boolean;
  paymentTermsId: string;
  cancellationPolicyId: string;
  skills: string[];
  software: string[];
  specialisms: string[];
  ppeProvided: boolean;
  isParkingAvailable: boolean;
  isPublicTransportAvailable: boolean;
  autoblockUnverified: boolean;
  mandatoryDocsForBooking: boolean;
  instantBook: boolean;
  approvalRequired: boolean;
  /** When true, posts with `status: "urgent"` (Boost / Urgent Fill) */
  boostUrgentFill: boolean;
};

export type LocumJobStepProps = {
  data: LocumJobFormData;
  onChange: <K extends keyof LocumJobFormData>(
    field: K,
    value: LocumJobFormData[K]
  ) => void;
  showValidation?: boolean;
};

/** Initial empty locum create form */
export function createInitialLocumJobFormData(): LocumJobFormData {
  return {
    roleId: "",
    locationId: "",
    date: "",
    timeStart: "",
    timeEnd: "",
    breakDurationMins: 0,
    rate: "",
    rateInterval: "",
    isOvertimePaid: false,
    paymentTermsId: "",
    cancellationPolicyId: "",
    skills: [],
    software: [],
    specialisms: [],
    ppeProvided: false,
    isParkingAvailable: false,
    isPublicTransportAvailable: false,
    autoblockUnverified: false,
    mandatoryDocsForBooking: false,
    instantBook: false,
    approvalRequired: false,
    boostUrgentFill: false,
  };
}

/**
 * Maps form state to the create-job API body.
 * Break of `0` becomes `null`.
 */
export function buildCreateLocumJobRequest(
  data: LocumJobFormData
): LocumJobFields & { type: "locum" } {
  const rate = Number.parseFloat(data.rate);

  return {
    type: "locum",
    roleId: data.roleId || undefined,
    locationId: data.locationId || undefined,
    date: data.date || undefined,
    timeStart: data.timeStart || undefined,
    timeEnd: data.timeEnd || undefined,
    breakDurationMins:
      data.breakDurationMins > 0 ? data.breakDurationMins : null,
    rate: Number.isFinite(rate) ? rate : undefined,
    rateInterval: data.rateInterval || undefined,
    isOvertimePaid: data.isOvertimePaid,
    paymentTermsId: data.paymentTermsId || undefined,
    cancellationPolicyId: data.cancellationPolicyId || undefined,
    skills: data.skills,
    software: data.software,
    specialisms: data.specialisms,
    ppeProvided: data.ppeProvided,
    isParkingAvailable: data.isParkingAvailable,
    isPublicTransportAvailable: data.isPublicTransportAvailable,
    autoblockUnverified: data.autoblockUnverified,
    mandatoryDocsForBooking: data.mandatoryDocsForBooking,
    instantBook: data.instantBook,
    approvalRequired: data.approvalRequired,
    status: data.boostUrgentFill ? "urgent" : "active",
  };
}
