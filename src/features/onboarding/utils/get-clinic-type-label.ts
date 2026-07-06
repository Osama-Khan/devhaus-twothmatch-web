import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";

/** Human-readable clinic type label for display */
export function getClinicTypeLabel(
  data: Pick<OnboardingFormData, "clinicTypeName" | "clinicType">
): string {
  return data.clinicTypeName.trim() || data.clinicType.trim() || "Not specified";
}
