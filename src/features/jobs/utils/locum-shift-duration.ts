const MINUTES_PER_DAY = 24 * 60;

/** Parse `HH:MM` (24h) into minutes from midnight */
export function parseTimeToMinutes(time: string): number | null {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(time.trim());
  if (!match) {
    return null;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}

/** Calculates if the shift bleeds over to the next day */
export function doesShiftBleedOverToNextDay(
  timeStart: string,
  timeEnd: string
): boolean {
  const start = parseTimeToMinutes(timeStart);
  const end = parseTimeToMinutes(timeEnd);
  if (start == null || end == null) {
    return false;
  }

  return end < start;
}

/**
 * Shift length in minutes.
 * When end is before start on the clock (e.g. 21:00–05:00), the window is
 * treated as crossing midnight into the next day.
 */
export function getShiftDurationMins(
  timeStart: string,
  timeEnd: string
): number | null {
  const start = parseTimeToMinutes(timeStart);
  const end = parseTimeToMinutes(timeEnd);

  if (start == null || end == null) {
    return null;
  }

  let duration = end - start;
  if (end < start) {
    duration += MINUTES_PER_DAY;
  }

  return duration > 0 ? duration : null;
}

export function getShiftDurationString(
  timeStart: string,
  timeEnd: string
): string {
  const duration = getShiftDurationMins(timeStart, timeEnd);
  if (duration == null) {
    return "";
  }

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

/** Whether start/end are at least `minGapMins` apart (overnight windows allowed) */
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
