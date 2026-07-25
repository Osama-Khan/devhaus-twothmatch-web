/** Completion section status returned with GET `/profile` */
export type ProfileCompletionSection = {
  key: string;
  complete: boolean;
};

/** Media row attached to a profile */
export type ProfileMedia = {
  id: string;
  userId: string;
  kind: string;
  url: string;
  createdAt: string;
  updatedAt: string;
};

/** Identity document row attached to a profile */
export type ProfileDocument = {
  id: string;
  userId: string;
  type: string;
  url: string;
};

/** Config metadata reference (e.g. clinic type from `types_of_clinics`) */
export type ProfileConfigRef = {
  id: string;
  name: string;
};

/** Candidate education row */
export type ProfileEducation = {
  id: string;
  userId: string;
  highestLevel?: ProfileConfigRef | null;
  institution?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string | null;
};

/** Candidate work experience row */
export type ProfileWorkExperience = {
  id: string;
  userId: string;
  company?: string;
  roleTitle?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  yearsExperience?: number | string | null;
  professionalRegNumber?: string | null;
};

/** Candidate work personality row */
export type ProfilePersonality = {
  id: string;
  userId: string;
  workingSuperpowers?: ProfileConfigRef[];
  favoriteWorkVibes?: ProfileConfigRef[];
  tacklingDifficultSituation?: ProfileConfigRef | null;
};

/** Named skill linked to a candidate profile */
export type ProfileSkill = {
  id: string;
  userId: string;
  skillId: string;
  Skill: {
    id: string;
    name: string;
  };
};

/** Named specialization linked to a candidate profile */
export type ProfileSpecialization = {
  id: string;
  userId: string;
  specializationId: string;
  Specialization: {
    id: string;
    name: string;
  };
};

/** Candidate job preferences row */
export type ProfileJobPreferences = {
  id: string;
  userId: string;
  idealJobTitle?: ProfileConfigRef | null;
  lookingFor?: ProfileConfigRef[];
  jobTypes?: ProfileConfigRef[];
  workingPatterns?: ProfileConfigRef[];
  payMin?: number;
  payMax?: number;
  hourlyRate?: string;
  currentAddress?: string;
  postcode?: string;
  latitude?: string;
  longitude?: string;
  searchRadiusKm?: string;
  salaryPreference?: string;
  isNegotiable?: boolean;
};

/** Candidate availability slot */
export type ProfileAvailabilitySlot = {
  id: string;
  userId: string;
  start: string;
  end: string;
};

/** Practice location row */
export type ProfileLocation = {
  id: string;
  userId: string;
  address: string;
  postcode: string;
  phone: string | null;
  /** Free-text parking notes from the practice */
  parking: string | null;
  /** Free-text public transport notes from the practice */
  publicTransport: string | null;
  practiceManagerName: string | null;
  email: string | null;
  practiceManagerPhone: string | null;
  latitude: string | number;
  longitude: string | number;
  createdAt?: string;
  updatedAt?: string;
};

/** Practice compliance section from GET `/profile` */
export type PracticeCompliance = {
  id: string;
  userId: string;
  yearsOfExperience: number | null;
  documentsRequired: ProfileConfigRef[];
  skills: ProfileConfigRef[];
  software: ProfileConfigRef[];
};

/** Practice culture section from GET `/profile` */
export type PracticeCulture = {
  id: string;
  userId: string;
  clinicCultureDescriptors: string | null;
  benefitsOffered: ProfileConfigRef[];
  workloadStyle: ProfileConfigRef | null;
};

/** Practice payment section from GET `/profile` */
export type PracticePayment = {
  id: string;
  userId: string;
  stripeAccountId: string | null;
  bankAccountDetails: string | null;
  invoiceEmail: string | null;
  billingAddress: string | null;
  defaultLocationRatesPerRole: unknown | null;
  cancellationPolicy: ProfileConfigRef | null;
};
