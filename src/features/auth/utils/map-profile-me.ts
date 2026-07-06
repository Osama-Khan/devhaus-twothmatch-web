import type { ProfileMeResponse, User } from "@/lib/types/entities";

/** Builds the Redux user from GET `/profile` when no session user exists yet */
export function createUserFromProfileMe(response: ProfileMeResponse): User {
  return mergeProfileMe(
    {
      id: response.profile.userId,
      email: "",
      role: response.kind === "practice" ? "practice" : "candidate",
    },
    response
  );
}

/**
 * Merges session auth fields with the unified GET `/profile` response.
 * Explicit API flag values always win over existing Redux user values.
 */
export function mergeProfileMe(
  baseUser: User,
  response: ProfileMeResponse
): User {
  const { profile, kind } = response;
  return {
    ...baseUser,
    profileKind: kind,
    fullName: profile?.fullName ?? baseUser.fullName,
    avatarUrl: profile?.avatar ?? baseUser.avatarUrl,
    completionPercent: profile.completionPercent,
    isProfileComplete:
      profile.profileCompletion !== undefined
        ? profile.profileCompletion
        : baseUser.isProfileComplete,
    isProfileVerified:
      profile.isVerified !== undefined
        ? profile.isVerified
        : baseUser.isProfileVerified,
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
