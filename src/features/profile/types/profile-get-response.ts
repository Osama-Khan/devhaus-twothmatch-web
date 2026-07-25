import type {
  PracticeCompliance,
  PracticeCulture,
  PracticePayment,
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

/** Shared profile status fields returned on GET `/profile` */
type ProfileStatusFields = {
  profileCompletion: boolean;
  completionPercent: number;
  isVerified: boolean;
  verifiedOn: string | null;
  verifiedComment: string | null;
  rejectedOn: string | null;
  rejectedComment: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Candidate profile core fields from GET `/profile` */
export type CandidateProfile = {
  id: string;
  userId: string;
  fullName?: string;
  gender?: string;
  jobTitle?: ProfileConfigRef | null;
  currentStatus?: ProfileConfigRef | null;
  linkedinUrl?: string;
  aboutMe?: string;
  avatar?: string | null;
} & Partial<ProfileStatusFields>;

/** Practice profile core fields from GET `/profile` */
export type PracticeProfile = {
  id: string;
  userId: string;
  about: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  phoneNumber: string | null;
  hideFromPublic: boolean;
  profileCompletion: boolean;
  completionPercent: number;
  isVerified: boolean;
  verifiedOn: string | null;
  verifiedComment: string | null;
  rejectedOn: string | null;
  rejectedComment: string | null;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  avatar: string | null;
  clinicType: ProfileConfigRef | null;
};

/** Full candidate profile payload from GET `/profile` */
export type CandidateProfileResponse = {
  userId: string;
  kind: "candidate";
  profile?: CandidateProfile;
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
  userId: string;
  kind: "practice";
  profile?: PracticeProfile;
  compliance?: PracticeCompliance | null;
  culture?: PracticeCulture | null;
  payment?: PracticePayment | null;
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
