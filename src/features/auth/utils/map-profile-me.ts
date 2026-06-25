import type { ProfileMeResponse, User } from "@/lib/types/entities";

/**
 * Merges a cached auth user with the unified `/profile/me` response.
 */
export function mergeProfileMe(
  baseUser: User,
  profile: ProfileMeResponse
): User {
  return {
    ...baseUser,
    profileKind: profile.kind,
    fullName: profile.profile.fullName ?? baseUser.fullName,
    avatarUrl: profile.profile.avatar ?? baseUser.avatarUrl,
    completionPercent: profile.completionPercent,
    isProfileComplete: profile.isProfileComplete ?? baseUser.isProfileComplete,
    isProfileVerified: profile.isProfileVerified ?? baseUser.isProfileVerified,
  };
}

/** Maps a login response user + flags into the Redux user shape */
export function userFromLogin(
  user: User,
  flags: {
    isProfileComplete: boolean;
    isProfileVerified: boolean;
    completionPercent: number;
  }
): User {
  return {
    ...user,
    isProfileComplete: flags.isProfileComplete,
    isProfileVerified: flags.isProfileVerified,
    completionPercent: flags.completionPercent,
  };
}
