import type {
  ProfileAvailabilitySlot,
  ProfileCompletionSection,
  ProfileConfigRef,
  ProfileDocument,
  ProfileEducation,
  ProfileJobPreferences,
  ProfileLocation,
  ProfileMedia,
  ProfilePersonality,
  ProfileSkill,
  ProfileSpecialization,
  ProfileWorkExperience,
} from "@/features/profile/types/profile-shared";

/** Candidate profile core fields from GET `/profile` */
export type CandidateProfile = {
  id: string;
  userId: string;
  fullName?: string;
  gender?: string;
  jobTitle?: string;
  currentStatus?: string;
  linkedinUrl?: string;
  aboutMe?: string;
  profileCompletion?: boolean;
  isVerified?: boolean;
  completionPercent?: number;
  avatar?: string;
};

/** Practice profile core fields from GET `/profile` */
export type PracticeProfile = {
  id: string;
  userId: string;
  clinicType?: ProfileConfigRef | null;
  about?: string;
  website?: string;
  phoneNumber?: string;
  fullName?: string;
  avatar?: string;
};

/** Full candidate profile payload from GET `/profile` */
export type CandidateProfileResponse = {
  kind: "candidate";
  profile: CandidateProfile;
  educations: ProfileEducation[];
  workExperiences: ProfileWorkExperience[];
  personality: ProfilePersonality | null;
  skills: ProfileSkill[];
  specializations: ProfileSpecialization[];
  media: ProfileMedia[];
  documents: ProfileDocument[];
  jobPreferences: ProfileJobPreferences | null;
  availabilitySlots: ProfileAvailabilitySlot[];
  completionPercent: number;
  completionSections: ProfileCompletionSection[];
};

/** Full practice profile payload from GET `/profile` */
export type PracticeProfileResponse = {
  kind: "practice";
  profile: PracticeProfile;
  media: ProfileMedia[];
  locations: ProfileLocation[];
  documents: ProfileDocument[];
  completionPercent: number;
  completionSections: ProfileCompletionSection[];
};

/** Discriminated union for GET `/profile` */
export type ProfileResponse =
  | CandidateProfileResponse
  | PracticeProfileResponse;

/** Type guard for candidate profile responses */
export function isCandidateProfileResponse(
  response: ProfileResponse
): response is CandidateProfileResponse {
  return response.kind === "candidate";
}

/** Type guard for practice profile responses */
export function isPracticeProfileResponse(
  response: ProfileResponse
): response is PracticeProfileResponse {
  return response.kind === "practice";
}
