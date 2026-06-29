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

/** Three-column home dashboard with profile, job feed, and shift details */
export function HomeView() {
  const [selectedJobId, setSelectedJobId] = useState(MOCK_JOBS[0]?.id ?? "");

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,320px)]">
      <ProfileSidebar profile={MOCK_PROFILE} events={MOCK_EVENTS} />

      <JobFeed
        jobs={MOCK_JOBS}
        selectedJobId={selectedJobId}
        onSelectJob={setSelectedJobId}
      />

      <ShiftDetailsSidebar shift={MOCK_SHIFT_DETAIL} />
    </main>
  );
}
