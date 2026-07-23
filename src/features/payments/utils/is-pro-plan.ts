/**
 * Whether a plan code is a Pro plan (e.g. `candidate_pro`, `practice_pro`).
 */
export function isProPlan(planCode: string | null | undefined): boolean {
  if (!planCode) return false;
  return planCode === "candidate_pro" || planCode === "practice_pro";
}
