import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import {
  onboardingAddressSchema,
  onboardingStep2Schema,
} from "@/features/onboarding/form/onboarding-step-schemas";

function isLogoSelected(data: OnboardingFormData): boolean {
  return (
    data.logoFileName.trim().length > 0 && data.logoFileName !== "Choose File"
  );
}

/** Whether the current step has all required fields filled and valid */
export function isOnboardingStepComplete(
  step: number,
  data: OnboardingFormData
): boolean {
  switch (step) {
    case 1:
      return Boolean(data.clinicType) && isLogoSelected(data);
    case 2:
      return onboardingStep2Schema.safeParse({
        clinicWebsite: data.clinicWebsite,
        phoneNumber: data.phoneNumber,
      }).success;
    case 3:
      return onboardingAddressSchema.safeParse({
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      }).success;
    default:
      return true;
  }
}
