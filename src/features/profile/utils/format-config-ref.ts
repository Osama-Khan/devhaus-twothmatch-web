import type { ProfileConfigRef } from "@/features/profile/types/profile-shared";

/**
 * Display name from a config-backed `{ id, name }` ref, or a legacy string label.
 */
export function formatConfigRefName(
  value: ProfileConfigRef | string | null | undefined
): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  const name = value.name?.trim();
  return name || null;
}

/**
 * Join display names from config-backed refs (or a legacy single string).
 */
export function formatConfigRefNames(
  values: ProfileConfigRef[] | string | null | undefined
): string | null {
  if (values == null) {
    return null;
  }

  if (typeof values === "string") {
    return formatConfigRefName(values);
  }

  const names = values
    .map((item) => formatConfigRefName(item))
    .filter((name): name is string => Boolean(name));

  return names.length > 0 ? names.join(", ") : null;
}
