"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ComingSoon02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

/** Placeholder while the candidate experience is unavailable on web */
export default function CandidatesComingSoonPage() {
  const { logout, isLoading } = useAuth();

  return (
    <main className="flex h-dvh flex-1 items-center justify-center p-8">
      <div className="relative flex flex-col gap-2 items-center max-w-80">
        <div className="flex items-center justify-center h-24 w-24 bg-primary/20 rounded-full">
          <HugeiconsIcon
            icon={ComingSoon02Icon}
            className="size-12 fill-background text-primary my-8"
          />
        </div>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          Coming Soon
        </p>
        <p className="text-sm text-muted-foreground text-center">
          Candidates are coming soon. The TwothMatch web app is currently
          available for practices only. We&apos;ll let you know when candidate
          access is ready.
        </p>
        <div className="h-4"></div>
        <Button variant="default" className="w-full" onClick={logout} disabled={isLoading}>
          Logout
        </Button>
      </div>
    </main>
  );
}
