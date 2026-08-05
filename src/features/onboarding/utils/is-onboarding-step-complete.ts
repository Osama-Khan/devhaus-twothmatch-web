import type { OnboardingFormData } from "@/features/onboarding/types/onboarding-form";
import {
  onboardingAddressSchema,
  onboardingPostcodeSchema,
  onboardingStep1Schema,
  onboardingStep2Schema,
} from "@/features/onboarding/form/onboarding-step-schemas";

/** Whether the current step has all required fields filled and valid */
export function isOnboardingStepComplete(
  step: number,
  data: OnboardingFormData
): boolean {
  switch (step) {
    case 1: {
      const hasLogo =
        Boolean(data.logoUrl) ||
        (data.logoFileName.length > 0 && data.logoFileName !== "Choose File");
      return (
        onboardingStep1Schema.safeParse({
          clinicName: data.clinicName,
          clinicType: data.clinicType,
          logoFileName: hasLogo ? "logo" : "Choose File",
        }).success
      );
    }
    case 2:
      return onboardingStep2Schema.safeParse({
        clinicWebsite: data.clinicWebsite,
        phoneNumber: data.phoneNumber,
      }).success;
    case 3:
      return (
        onboardingAddressSchema.safeParse({
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
        }).success &&
        onboardingPostcodeSchema.safeParse(data.postcode).success
      );
    case 4:
      return data.documentsRequiredIds.length > 0;
    case 5:
      return data.cancellationPolicyId.trim().length > 0;
    case 6:
      // Culture step is optional
      return true;
    default:
      return true;
  }
}
