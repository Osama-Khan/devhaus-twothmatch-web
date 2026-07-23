import { appRoutes } from "@/lib/routes";
import type { User } from "@/lib/types/entities";
import { isCandidateUser } from "@/features/auth/utils/is-candidate-user";
import { needsOnboarding } from "@/features/onboarding/utils/needs-onboarding";
import { needsVerification } from "@/features/onboarding/utils/needs-verification";

/**
 * Locked route for the user, if any — candidate gate, onboarding, or verification.
 */
export function getProfileSetupPath(user: User): string | null {
  if (isCandidateUser(user)) {
    return appRoutes.onboarding.candidatesComingSoon._self.path;
  }

  if (needsOnboarding(user)) {
    return appRoutes.onboarding._self.path;
  }

  if (needsVerification(user)) {
    return appRoutes.onboarding.verifying._self.path;
  }

  return null;
}

