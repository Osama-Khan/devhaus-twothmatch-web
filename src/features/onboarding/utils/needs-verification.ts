import type { User } from "@/lib/types/entities";
import { needsOnboarding } from "@/features/onboarding/utils/needs-onboarding";

/**
 * True when onboarding is done but profile verification is still pending.
 */
export function needsVerification(user: User | null | undefined): boolean {
  return Boolean(
    user &&
      !needsOnboarding(user) &&
      user.isProfileVerified !== true
  );
}
