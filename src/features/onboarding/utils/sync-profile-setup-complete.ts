import type { User } from "@/lib/types/entities";
import { setUserSnapshot } from "@/lib/services/token-storage";
import { setUser } from "@/lib/store/auth-slice";
import type { AppDispatch } from "@/lib/store";

/** User flags after onboarding publish — complete but awaiting verification */
export function markProfileSetupComplete(user: User): User {
  return {
    ...user,
    isProfileComplete: true,
    isProfileVerified: false,
  };
}

/** Updates Redux and persisted auth snapshot with post-onboarding profile flags */
export function syncProfileSetupComplete(
  dispatch: AppDispatch,
  user: User
): User {
  const updatedUser = markProfileSetupComplete(user);
  dispatch(setUser(updatedUser));
  setUserSnapshot(updatedUser);
  return updatedUser;
}
