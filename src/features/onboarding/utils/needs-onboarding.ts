import type { User } from "@/lib/types/entities";

/**
 * True when the signed-in user must complete onboarding before using the app.
 */
export function needsOnboarding(user: User | null | undefined): boolean {
  return Boolean(user && user.isProfileComplete !== true);
}
