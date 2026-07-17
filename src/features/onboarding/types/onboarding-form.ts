/** Collected onboarding answers across all seven steps */
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
