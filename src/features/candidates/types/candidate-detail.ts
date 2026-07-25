import type { ProfileConfigRef } from "@/features/profile/types/profile-shared";

/** Candidate profile summary from GET `/candidates/:id` */
export type CandidateProfile = {
  id: string;
  userId: string;
  fullName: string;
  gender?: string;
  jobTitle: ProfileConfigRef | null;
  currentStatus?: ProfileConfigRef | null;
  linkedinUrl?: string | null;
  aboutMe?: string | null;
  isVerified: boolean;
  avatar?: string | null;
};

export type CandidateEducation = {
  id: string;
  userId: string;
  highestLevel: ProfileConfigRef | null;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string | null;
};

export type CandidateWorkExperience = {
  id: string;
  userId: string;
  company: string;
  roleTitle: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  yearsExperience: string | number | null;
  professionalRegNumber: string | null;
};

export type CandidatePersonality = {
  id: string;
  userId: string;
  workingSuperpowers: ProfileConfigRef[];
  favoriteWorkVibes: ProfileConfigRef[];
  tacklingDifficultSituation: ProfileConfigRef | null;
};

export type NamedEntity = {
  id: string;
  name: string;
};

export type CandidateSkill = {
  id: string;
  userId: string;
  skillId: string;
  Skill: NamedEntity;
};

export type CandidateSpecialization = {
  id: string;
  userId: string;
  specializationId: string;
  Specialization: NamedEntity;
};

export type CandidateJobPreferences = {
  id: string;
  userId: string;
  idealJobTitle: ProfileConfigRef | null;
  lookingFor: ProfileConfigRef[];
  jobTypes: ProfileConfigRef[];
  workingPatterns: ProfileConfigRef[];
  payMin: number | null;
  payMax: number | null;
  hourlyRate: string | null;
  currentAddress: string;
  postcode: string;
  latitude: string;
  longitude: string;
  searchRadiusKm: string;
  salaryPreference: string | null;
  isNegotiable: boolean;
};

export type CandidateAvailabilitySlot = {
  id: string;
  userId: string;
  dateTime: string;
};

/** Full candidate detail payload for practice detail view */
export type CandidateDetailResponse = {
  profile: CandidateProfile;
  educations: CandidateEducation[];
  workExperiences: CandidateWorkExperience[];
  personality: CandidatePersonality | null;
  skills: CandidateSkill[];
  specializations: CandidateSpecialization[];
  jobPreferences: CandidateJobPreferences | null;
  availabilitySlots: CandidateAvailabilitySlot[];
  ratings: unknown[];
};
