import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import {
  onboardingAddressSchema,
  onboardingStep1Schema,
  onboardingStep2Schema,
} from "@/features/onboarding/form/onboarding-step-schemas";

/** Whether the current step has all required fields filled and valid */
export function isOnboardingStepComplete(
  step: number,
  data: OnboardingFormData
): boolean {
  switch (step) {
    case 1:
      return onboardingStep1Schema.safeParse({
        clinicName: data.clinicName,
        clinicType: data.clinicType,
        logoFileName: data.logoFileName,
      }).success;
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
