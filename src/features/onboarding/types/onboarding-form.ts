import type { ClinicType } from "@/features/onboarding/constants";

/** Collected onboarding answers across all seven steps */
export type OnboardingFormData = {
  clinicType: ClinicType;
  logoFileName: string;
  clinicPictureCount: number;
  teamPhotoCount: number;
  clinicWebsite: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  phoneNumber: string;
  hideFromPublic: boolean;
  address: string;
  addressPlaceId: string;
  latitude: number | null;
  longitude: number | null;
  locationPhone: string;
  parking: string;
  publicTransport: string;
  branchManagerContact: string;
  documentsRequired: string;
  yearsOfExperience: string;
  skillsSoftwareRequired: string;
  stripeBankDetails: string;
  invoiceEmailBilling: string;
  defaultLocumRates: string;
  cancellationPolicy: string;
  clinicCultureDescriptors: string;
  benefitsOffered: string;
  workloadStyle: string;
};

export type OnboardingStepProps = {
  data: OnboardingFormData;
  onChange: <K extends keyof OnboardingFormData>(
    field: K,
    value: OnboardingFormData[K]
  ) => void;
  showValidation?: boolean;
};

/** Default empty onboarding form state */
export function createInitialOnboardingFormData(): OnboardingFormData {
  return {
    clinicType: "nhs",
    logoFileName: "Choose File",
    clinicPictureCount: 0,
    teamPhotoCount: 0,
    clinicWebsite: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    phoneNumber: "",
    hideFromPublic: true,
    address: "",
    addressPlaceId: "",
    latitude: null,
    longitude: null,
    locationPhone: "",
    parking: "",
    publicTransport: "",
    branchManagerContact: "",
    documentsRequired: "",
    yearsOfExperience: "",
    skillsSoftwareRequired: "",
    stripeBankDetails: "",
    invoiceEmailBilling: "",
    defaultLocumRates: "",
    cancellationPolicy: "",
    clinicCultureDescriptors: "",
    benefitsOffered: "",
    workloadStyle: "",
  };
}
