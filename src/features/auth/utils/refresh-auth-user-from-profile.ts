import { profileService } from "@/features/profile/services/profile-service";
import { mergeProfileResponse } from "@/features/auth/utils/map-profile-response";
import type { AppDispatch } from "@/lib/store";
import type { User } from "@/lib/types/entities";
import { isSuccessResponse } from "@/lib/types/response";
import { setCredentials, setUser } from "@/lib/store/auth-slice";

type SyncAuthUserOptions = {
  /** When provided, updates credentials (user + token) instead of user only */
  token?: string;
};

/** Persists the auth user to Redux */
export function syncAuthUser(
  dispatch: AppDispatch,
  user: User,
  options: SyncAuthUserOptions = {}
): void {
  if (options.token) {
    dispatch(setCredentials({ user, token: options.token }));
  } else {
    dispatch(setUser(user));
  }
}

/**
 * Fetches GET `/profile` and merges the response into the auth user, then
 * persists the result to Redux.
 */
export async function refreshAuthUserFromProfile(
  dispatch: AppDispatch,
  baseUser: User,
  options: SyncAuthUserOptions = {}
): Promise<{ user?: User; error?: string }> {
  const response = await profileService.getProfile();

  if (!isSuccessResponse(response)) {
    return { error: response.error };
  }

  const user = mergeProfileResponse(baseUser, response.data);
  syncAuthUser(dispatch, user, options);
  return { user };
}
