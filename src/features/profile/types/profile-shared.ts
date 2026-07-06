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
  highestLevel?: string;
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
};

/** Candidate work personality row */
export type ProfilePersonality = {
  id: string;
  userId: string;
  workingSuperpower?: string;
  favoriteWorkVibe?: string;
  tacklingDifficultSituations?: string;
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
  idealJobTitle?: string;
  lookingFor?: string;
  jobType?: string;
  workingPattern?: string;
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
  parking: string | null;
  publicTransport: string | null;
  practiceManagerName: string | null;
  email: string | null;
  practiceManagerPhone: string | null;
  latitude: string;
  longitude: string;
  createdAt: string;
  updatedAt: string;
};
