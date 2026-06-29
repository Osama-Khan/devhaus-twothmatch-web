import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";

function hasText(value: string): boolean {
  return value.trim().length > 0;
}

function isLogoSelected(data: OnboardingFormData): boolean {
  return data.logoFileName.trim().length > 0 && data.logoFileName !== "Choose File";
}

/** Whether the current step has all required fields filled */
export function isOnboardingStepComplete(
  step: number,
  data: OnboardingFormData
): boolean {
  switch (step) {
    case 1:
      return Boolean(data.clinicType) && isLogoSelected(data);
    case 2:
      return hasText(data.clinicWebsite) && hasText(data.phoneNumber);
    case 3:
      return hasText(data.address);
    default:
      return true;
  }
}
