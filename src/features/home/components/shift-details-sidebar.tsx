import { HugeiconsIcon } from "@hugeicons/react";
import {
  Location01Icon,
  StarIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { IconTextRow } from "@/features/home/components/icon-text-row";
import type { ShiftDetail } from "@/features/home/types/shift-detail";
import { cn } from "@/lib/utils";

type ShiftDetailsSidebarProps = {
  shift: ShiftDetail;
  className?: string;
};

/** Right column shift detail panel for the selected job */
export function ShiftDetailsSidebar({ shift, className }: ShiftDetailsSidebarProps) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-foreground">Shift Details</h2>

      <div className="mt-5 space-y-5">
        <div className="rounded-xl bg-muted/60 p-4">
          <h3 className="text-base font-semibold text-foreground">
            {shift.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {shift.clinicName} | {shift.clinicLocation}
          </p>
          <p className="mt-3 text-xl font-semibold text-primary">{shift.rate}</p>
          <p className="text-sm text-muted-foreground">{shift.time}</p>
          <div className="mt-3 rounded-lg bg-background px-3 py-2 text-sm text-muted-foreground">
            Duration: {shift.duration} | Total: {shift.totalPay}
          </div>
        </div>

        <div className="rounded-xl bg-muted/40 p-4">
          <IconTextRow icon={Location01Icon} value={shift.address} />
          <p className="mt-2 pl-6 text-sm text-muted-foreground">{shift.commute}</p>
        </div>

        <section>
          <h3 className="text-sm font-semibold text-foreground">
            Why this is a great match
          </h3>
          <ul className="mt-3 space-y-2">
            {shift.matchReasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2 text-sm">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  strokeWidth={2}
                  className="mt-0.5 size-4 shrink-0 text-primary"
                />
                <span className="text-muted-foreground">{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-foreground">Requirements</h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {shift.requirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-background p-4">
          <h3 className="text-sm font-semibold text-foreground">
            Clinic Information
          </h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
              {shift.clinic.logoInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {shift.clinic.name}
              </p>
              <p className="text-xs text-muted-foreground">{shift.clinic.type}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
              <HugeiconsIcon
                icon={StarIcon}
                strokeWidth={2}
                className="size-4 text-[#f5a623]"
              />
              {shift.clinic.rating}
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-foreground">
            Cancellation Policy
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {shift.cancellationPolicy}
          </p>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="outline" type="button">
          Interested
        </Button>
        <Button type="button">Book Shift</Button>
      </div>
    </aside>
  );
}
