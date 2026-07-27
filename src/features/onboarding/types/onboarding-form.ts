/** Collected practice onboarding answers across all steps */
export type OnboardingFormData = {
  clinicName: string;
  /** Config item id from `types_of_clinics` */
  clinicType: string;
  /** Display label for the selected clinic type */
  clinicTypeName: string;
  logoFileName: string;
  logoFile: File | null;
  clinicPictureCount: number;
  clinicPictureFiles: File[];
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
  postcode: string;
  locationPhone: string;
  parking: boolean;
  publicTransport: boolean;
  branchManagerName: string;
  branchManagerContact: string;
  branchManagerEmail: string;
  /** Config ids from `documents_required` */
  documentsRequiredIds: string[];
  /** Config ids from `skills_required` */
  skillIds: string[];
  /** Config ids from `software_required` */
  softwareIds: string[];
  stripeBankDetails: string;
  invoiceEmailBilling: string;
  defaultLocumRates: string;
  /** Config id from `cancellation_policies` */
  cancellationPolicyId: string;
  cancellationPolicyName: string;
  clinicCultureDescriptors: string;
  /** Config ids from `benefits_offered` */
  benefitsOfferedIds: string[];
  /** Config id from `work_load` */
  workloadStyleId: string;
  workloadStyleName: string;
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
    clinicName: "",
    clinicType: "",
    clinicTypeName: "",
    logoFileName: "Choose File",
    logoFile: null,
    clinicPictureCount: 0,
    clinicPictureFiles: [],
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
    postcode: "",
    locationPhone: "",
    parking: false,
    publicTransport: false,
    branchManagerName: "",
    branchManagerContact: "",
    branchManagerEmail: "",
    documentsRequiredIds: [],
    skillIds: [],
    softwareIds: [],
    stripeBankDetails: "",
    invoiceEmailBilling: "",
    defaultLocumRates: "",
    cancellationPolicyId: "",
    cancellationPolicyName: "",
    clinicCultureDescriptors: "",
    benefitsOfferedIds: [],
    workloadStyleId: "",
    workloadStyleName: "",
  };
}
