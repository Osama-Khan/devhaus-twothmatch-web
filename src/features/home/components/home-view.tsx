"use client";

import { useState } from "react";
import { JobFeed } from "@/features/home/components/job-feed";
import { ProfileSidebar } from "@/features/home/components/profile-sidebar";
import { ShiftDetailsSidebar } from "@/features/home/components/shift-details-sidebar";
import {
  MOCK_EVENTS,
  MOCK_JOBS,
  MOCK_PROFILE,
  MOCK_SHIFT_DETAIL,
} from "@/features/home/mock/home-mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";

const ScrollSpacer = <div className="h-8"></div>;

/** Three-column home dashboard with profile, job feed, and shift details */
export function HomeView() {
  const [selectedJobId, setSelectedJobId] = useState(MOCK_JOBS[0]?.id ?? "");

  return (
    <main className="mx-auto flex h-full min-h-0 max-w-7xl flex-row overflow-hidden px-4">
      <div className="flex w-70 min-h-0 shrink-0 flex-col">
        <ScrollArea className="h-full">
          {ScrollSpacer}
          <ProfileSidebar profile={MOCK_PROFILE} events={MOCK_EVENTS} />
          {ScrollSpacer}
        </ScrollArea>
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ScrollArea className="h-full">
          {ScrollSpacer}
          <div className="px-6">
            <JobFeed
              jobs={MOCK_JOBS}
              selectedJobId={selectedJobId}
              onSelectJob={setSelectedJobId}
            />
          </div>
          {ScrollSpacer}
        </ScrollArea>
      </div>

      <div className="flex w-80 min-h-0 shrink-0 flex-col">
        <ScrollArea className="h-full">
          {ScrollSpacer}
          <ShiftDetailsSidebar shift={MOCK_SHIFT_DETAIL} />
          {ScrollSpacer}
        </ScrollArea>
      </div>
    </main>
  );
}
