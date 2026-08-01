import {
  doesShiftBleedOverToNextDay,
  getShiftDurationString,
} from "@/features/jobs/utils/locum-shift-duration";

type ShiftTimeStatsProps = {
  start: string;
  end: string;
};

/** Overnight bleed note and formatted shift duration under time inputs */
export function ShiftTimeStats({ start, end }: ShiftTimeStatsProps) {
  const bleedsOver = doesShiftBleedOverToNextDay(start, end);
  const duration = getShiftDurationString(start, end);

  if (!bleedsOver && !duration) {
    return null;
  }

  return (
    <div className="-mt-3 flex flex-row justify-between gap-2">
      {bleedsOver ? (
        <p className="text-xs text-muted-foreground">
          The shift will end on the next day.
        </p>
      ) : null}
      {duration ? (
        <p className="ml-auto text-xs text-muted-foreground">
          Shift Time: {duration}
        </p>
      ) : null}
    </div>
  );
}
