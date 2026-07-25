/** Education row for PUT `/profile` — replaces all rows when present */
export type UpdateProfileEducation = {
  highestLevelId?: string;
  institution?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string | null;
};

/** Work experience row for PUT `/profile` — replaces all rows when present */
export type UpdateProfileWorkExperience = {
  company?: string;
  roleTitle?: string;
  startDate?: string;
  endDate?: string | null;
  isCurrent?: boolean;
  yearsExperience?: number;
  professionalRegNumber?: string;
};

/** Media row for PUT `/profile` — merged by kind */
export type UpdateProfileMedia = {
  kind: string;
  url: string;
};

/** Document row for PUT `/profile` — replaces all rows when present */
export type UpdateProfileDocument = {
  type: string;
  url: string;
};

/** Practice location row for PUT `/profile` — replaces all rows when present */
export type UpdateProfileLocation = {
  address?: string;
  postcode?: string;
  phone?: string;
  /** Free-text parking notes */
  parking?: string;
  /** Free-text public transport notes */
  publicTransport?: string;
  practiceManagerName?: string;
  email?: string;
  practiceManagerPhone?: string;
  latitude?: number;
  longitude?: number;
};

/** Partial job preferences object for PUT `/profile` */
export type UpdateProfileJobPreferences = {
  idealJobTitleId?: string;
  lookingForIds?: string[];
  jobTypeIds?: string[];
  workingPatternIds?: string[];
  payMin?: number;
  payMax?: number;
  hourlyRate?: number;
  currentAddress?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  searchRadiusKm?: number;
  salaryPreference?: string;
  isNegotiable?: boolean;
};

/** Availability slot for PUT `/profile` — replaces all rows when present */
export type UpdateProfileAvailabilitySlot = {
  start: string;
  end: string;
};

/**
 * Request body for PUT `/profile`.
 * Send only the sections to update; omitted keys are left unchanged.
 * Array sections replace all existing rows when present.
 *
 * Config-backed fields use `*Id` / `*Ids` only — legacy label strings are rejected.
 */
export type UpdateProfileRequest = {
  /** Practice — basic business info */
  clinicName?: string;
  clinicTypeId?: string;
  about?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  phoneNumber?: string;
  hideFromPublic?: boolean;
  /** Practice — compliance */
  yearsOfExperience?: number;
  documentsRequiredIds?: string[];
  /** Practice skills from `skills_required` (candidate skills also use this key) */
  skillIds?: string[];
  softwareIds?: string[];
  /** Practice — culture */
  clinicCultureDescriptors?: string;
  benefitsOfferedIds?: string[];
  workloadStyleId?: string;
  /** Practice — payment */
  cancellationPolicyId?: string;
  /** Candidate — basic profile info */
  fullName?: string;
  gender?: string;
  jobTitleId?: string;
  currentStatusId?: string;
  linkedinUrl?: string;
  aboutMe?: string;
  educations?: UpdateProfileEducation[];
  workExperiences?: UpdateProfileWorkExperience[];
  workingSuperpowerIds?: string[];
  favoriteWorkVibeIds?: string[];
  tacklingDifficultSituationId?: string;
  /** Candidate specializations from `specialisations` */
  specializationIds?: string[];
  media?: UpdateProfileMedia[];
  documents?: UpdateProfileDocument[];
  locations?: UpdateProfileLocation[];
  jobPreferences?: UpdateProfileJobPreferences;
  availabilitySlots?: UpdateProfileAvailabilitySlot[];
};
