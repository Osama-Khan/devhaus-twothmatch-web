import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/types/entities";
import { needsOnboarding } from "@/features/onboarding/utils/needs-onboarding";
import { needsVerification } from "@/features/onboarding/utils/needs-verification";

/**
 * Locked setup route for the user, if any — onboarding or verification.
 */
export function getProfileSetupPath(user: User): string | null {
  if (needsOnboarding(user)) {
    return appRoutes.onboarding._self.path;
  }

  if (needsVerification(user)) {
    return appRoutes.onboarding.verifying._self.path;
  }

  return null;
}
