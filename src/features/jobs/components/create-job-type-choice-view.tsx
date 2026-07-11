"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase07Icon,
  Calendar03Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { createRoute } from "@/lib/utils/route";
import { appRoutes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { CreateJobRouteType } from "@/features/jobs/constants";

type CreateJobTypeChoiceViewProps = {
  className?: string;
};

const JOB_TYPE_OPTIONS: {
  type: CreateJobRouteType;
  title: string;
  description: string;
  icon: typeof Briefcase07Icon;
}[] = [
  {
    type: "locum",
    title: "Locum shift",
    description: "Post a short-term locum shift with rates and schedule.",
    icon: Calendar03Icon,
  },
  {
    type: "permanent",
    title: "Permanent job",
    description: "Post a permanent role with salary, benefits, and details.",
    icon: Briefcase07Icon,
  },
];

/** Locum vs permanent choice before entering the create-job stepper */
export function CreateJobTypeChoiceView({
  className,
}: CreateJobTypeChoiceViewProps) {
  return (
    <div className={cn("flex w-full max-w-lg flex-col gap-6", className)}>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Create Job
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose the type of listing you want to post.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {JOB_TYPE_OPTIONS.map((option) => {
          const href = createRoute(appRoutes.nav.myJobs.create.byType._self, {
            type: option.type,
          }).path;

          return (
            <Button
              key={option.type}
              asChild
              variant="outline"
              className="h-auto justify-start gap-4 rounded-3xl border-border bg-card p-5 text-left whitespace-normal shadow-sm hover:bg-muted"
            >
              <Link href={href}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <HugeiconsIcon
                    icon={option.icon}
                    strokeWidth={2}
                    className="size-5"
                  />
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-base font-semibold text-foreground">
                    {option.title}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {option.description}
                  </span>
                </span>
              </Link>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
