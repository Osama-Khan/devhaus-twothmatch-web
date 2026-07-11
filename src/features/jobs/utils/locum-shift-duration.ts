/** Parse `HH:MM` (24h) into minutes from midnight */
export function parseTimeToMinutes(time: string): number | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

/** Shift length in minutes when end is after start on the same day */
export function getShiftDurationMins(
  timeStart: string,
  timeEnd: string
): number | null {
  const start = parseTimeToMinutes(timeStart);
  const end = parseTimeToMinutes(timeEnd);

  if (start == null || end == null) {
    return null;
  }

  const duration = end - start;
  return duration > 0 ? duration : null;
}

/** Whether start/end are at least `minGapMins` apart */
export function hasMinimumShiftGap(
  timeStart: string,
  timeEnd: string,
  minGapMins = 30
): boolean {
  const duration = getShiftDurationMins(timeStart, timeEnd);
  return duration != null && duration >= minGapMins;
}

/**
 * Max break minutes: shift duration minus 20.
 * Returns `null` when times are incomplete or invalid.
 */
export function getMaxBreakDurationMins(
  timeStart: string,
  timeEnd: string
): number | null {
  const duration = getShiftDurationMins(timeStart, timeEnd);
  if (duration == null) {
    return null;
  }

  return Math.max(0, duration - 20);
}
