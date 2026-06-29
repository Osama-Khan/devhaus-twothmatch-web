"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";

/** Onboarding route group — no app chrome; per-route guards in nested layouts */
export default function OnboardingRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          onClick={() => void logout()}
        >
          Logout
        </Button>
      </div>
      {children}
    </div>
  );
}
