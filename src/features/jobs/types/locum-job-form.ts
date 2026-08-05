import type {
  JobRateInterval,
  LocumJobFields,
  UpdateJobRequest,
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

/** Locum step 1 fields (shift basics). */
export function buildLocumStep1Fields(
  data: LocumJobFormData
): Pick<
  LocumJobFields,
  "roleId" | "locationId" | "date" | "timeStart" | "timeEnd" | "breakDurationMins"
> {
  return {
    roleId: data.roleId || undefined,
    locationId: data.locationId || undefined,
    date: data.date || undefined,
    timeStart: data.timeStart || undefined,
    timeEnd: data.timeEnd || undefined,
    breakDurationMins:
      data.breakDurationMins > 0 ? data.breakDurationMins : null,
  };
}

/** Locum step 2 fields (rate / payment). */
export function buildLocumStep2Fields(
  data: LocumJobFormData
): Pick<
  LocumJobFields,
  | "rate"
  | "rateInterval"
  | "isOvertimePaid"
  | "paymentTermsId"
  | "cancellationPolicyId"
> {
  const rate = Number.parseFloat(data.rate);
  return {
    rate: Number.isFinite(rate) ? rate : undefined,
    rateInterval: data.rateInterval || undefined,
    isOvertimePaid: data.isOvertimePaid,
    paymentTermsId: data.paymentTermsId || undefined,
    cancellationPolicyId: data.cancellationPolicyId || undefined,
  };
}

/** Locum step 3 fields (role requirements). */
export function buildLocumStep3Fields(
  data: LocumJobFormData
): Pick<
  LocumJobFields,
  | "skills"
  | "software"
  | "specialisms"
  | "ppeProvided"
  | "isParkingAvailable"
  | "isPublicTransportAvailable"
> {
  return {
    skills: data.skills,
    software: data.software,
    specialisms: data.specialisms,
    ppeProvided: data.ppeProvided,
    isParkingAvailable: data.isParkingAvailable,
    isPublicTransportAvailable: data.isPublicTransportAvailable,
  };
}

/** Locum step 4 fields (compliance filters). */
export function buildLocumStep4Fields(
  data: LocumJobFormData
): Pick<LocumJobFields, "autoblockUnverified" | "mandatoryDocsForBooking"> {
  return {
    autoblockUnverified: data.autoblockUnverified,
    mandatoryDocsForBooking: data.mandatoryDocsForBooking,
  };
}

/** Locum step 5 fields (booking mode). */
export function buildLocumStep5Fields(
  data: LocumJobFormData
): Pick<LocumJobFields, "instantBook" | "approvalRequired"> {
  return {
    instantBook: data.instantBook,
    approvalRequired: data.approvalRequired,
  };
}

/** Locum step 6 preview fields (boost flag applied only on publish). */
export function buildLocumStep6Fields(
  _data: LocumJobFormData
): Record<string, never> {
  return {};
}

/**
 * Partial fields for a locum wizard step (no `isDraft` / `status`).
 */
export function buildLocumStepFields(
  step: number,
  data: LocumJobFormData
): LocumJobFields {
  switch (step) {
    case 1:
      return buildLocumStep1Fields(data);
    case 2:
      return buildLocumStep2Fields(data);
    case 3:
      return buildLocumStep3Fields(data);
    case 4:
      return buildLocumStep4Fields(data);
    case 5:
      return buildLocumStep5Fields(data);
    case 6:
      return buildLocumStep6Fields(data);
    default:
      return {};
  }
}

/**
 * POST body for creating a locum draft from step 1.
 */
export function buildCreateLocumDraftRequest(
  data: LocumJobFormData
): LocumJobFields & { type: "locum"; isDraft: true } {
  return {
    type: "locum",
    isDraft: true,
    ...buildLocumStep1Fields(data),
  };
}

/**
 * PATCH body to publish an existing locum draft.
 * Includes final fields and sets `isDraft: false` + status.
 */
export function buildPublishLocumJobRequest(
  jobId: string,
  data: LocumJobFormData
): UpdateJobRequest {
  return {
    id: jobId,
    type: "locum",
    isDraft: false,
    ...buildLocumStep1Fields(data),
    ...buildLocumStep2Fields(data),
    ...buildLocumStep3Fields(data),
    ...buildLocumStep4Fields(data),
    ...buildLocumStep5Fields(data),
    status: data.boostUrgentFill ? "urgent" : "active",
  };
}

/**
 * Maps form state to the create-job API body (full publish create).
 * Prefer draft-first flow; kept for compatibility.
 */
export function buildCreateLocumJobRequest(
  data: LocumJobFormData
): LocumJobFields & { type: "locum"; isDraft: false } {
  return {
    type: "locum",
    isDraft: false,
    ...buildLocumStep1Fields(data),
    ...buildLocumStep2Fields(data),
    ...buildLocumStep3Fields(data),
    ...buildLocumStep4Fields(data),
    ...buildLocumStep5Fields(data),
    status: data.boostUrgentFill ? "urgent" : "active",
  };
}
