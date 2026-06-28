import {
  CLINIC_TYPE_OPTIONS,
  type ClinicType,
} from "@/features/onboarding/constants";

/** Human-readable clinic type label for display */
export function getClinicTypeLabel(clinicType: ClinicType): string {
  return (
    CLINIC_TYPE_OPTIONS.find((option) => option.value === clinicType)?.label ??
    clinicType
  );
}
