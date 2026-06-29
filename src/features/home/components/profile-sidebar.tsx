import type {
  ProfileSummary,
  UpcomingEvent,
} from "@/features/home/mock/home-mock-data";
import { ProfileCard } from "@/features/home/components/profile-card";
import { UpcomingEventsCard } from "@/features/home/components/upcoming-events-card";
import { cn } from "@/lib/utils";

type ProfileSidebarProps = {
  profile: ProfileSummary;
  events: UpcomingEvent[];
  className?: string;
};

/** Left column: practice profile and upcoming events */
export function ProfileSidebar({ profile, events, className }: ProfileSidebarProps) {
  return (
    <aside className={cn("flex flex-col gap-5", className)}>
      <ProfileCard profile={profile} />
      <UpcomingEventsCard events={events} />
    </aside>
  );
}
