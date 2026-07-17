/** Education row for PUT `/profile` — replaces all rows when present */
export type UpdateProfileEducation = {
  highestLevel?: string;
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
  parking?: boolean;
  publicTransport?: boolean;
  practiceManagerName?: string;
  email?: string;
  practiceManagerPhone?: string;
  latitude?: number;
  longitude?: number;
};

/** Partial job preferences object for PUT `/profile` */
export type UpdateProfileJobPreferences = {
  idealJobTitle?: string;
  lookingFor?: string;
  jobType?: string;
  workingPattern?: string;
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
  /** Candidate — basic profile info */
  fullName?: string;
  gender?: string;
  jobTitle?: string;
  currentStatus?: string;
  linkedinUrl?: string;
  aboutMe?: string;
  educations?: UpdateProfileEducation[];
  workExperiences?: UpdateProfileWorkExperience[];
  workingSuperpower?: string;
  favoriteWorkVibe?: string;
  tacklingDifficultSituations?: string;
  /** Skill names — replaces all user skills when present */
  skillIds?: string[];
  /** Specialization names — replaces all user specializations when present */
  specializationIds?: string[];
  media?: UpdateProfileMedia[];
  documents?: UpdateProfileDocument[];
  locations?: UpdateProfileLocation[];
  jobPreferences?: UpdateProfileJobPreferences;
  availabilitySlots?: UpdateProfileAvailabilitySlot[];
};
