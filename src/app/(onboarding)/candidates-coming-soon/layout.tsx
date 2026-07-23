import { RequireCandidatesComingSoon } from "@/features/auth/utils/require-candidates-coming-soon";

/** Candidates coming-soon step — candidate accounts only */
export default function CandidatesComingSoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireCandidatesComingSoon>{children}</RequireCandidatesComingSoon>
  );
}
