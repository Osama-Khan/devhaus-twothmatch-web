export type {
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

export type {
  CandidateProfile,
  CandidateProfileResponse,
  PracticeProfile,
  PracticeProfileResponse,
  ProfileResponse,
} from "@/features/profile/types/profile-get-response";

export {
  isCandidateProfileResponse,
  isPracticeProfileResponse,
} from "@/features/profile/types/profile-get-response";

export type {
  UpdateProfileAvailabilitySlot,
  UpdateProfileDocument,
  UpdateProfileEducation,
  UpdateProfileJobPreferences,
  UpdateProfileLocation,
  UpdateProfileMedia,
  UpdateProfileRequest,
  UpdateProfileWorkExperience,
} from "@/features/profile/types/update-profile-request";

export type { UpdateProfileResponse } from "@/features/profile/types/update-profile-response";
