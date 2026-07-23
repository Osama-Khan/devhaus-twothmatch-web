import type { User } from "@/lib/types/entities";

/**
 * Whether the signed-in user is a candidate (web app not available yet).
 */
export function isCandidateUser(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  return user.role === "candidate" || user.profileKind === "candidate";
}
