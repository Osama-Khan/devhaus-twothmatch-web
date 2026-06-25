import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/types/entities";
import { getProfileSetupPath } from "@/features/onboarding/utils/get-profile-setup-path";

/**
 * Destination after login or when redirecting authenticated users away from auth pages.
 */
export function getPostAuthPath(user: User): string {
  return getProfileSetupPath(user) ?? appRoutes.home._self.path;
}
