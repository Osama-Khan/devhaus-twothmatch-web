"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { appRoutes } from "@/lib/routes";
import { APP_NAME } from "@/lib/constants/app";

/** Main dashboard placeholder for authenticated users */
export function DashboardView() {
  const { isAuthenticated, isLoading, user } = useAuth();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{APP_NAME}</h1>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading session…"
            : isAuthenticated
              ? `Signed in as ${user?.fullName ?? user?.email} (${user?.role})`
              : "You are not signed in"}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {isAuthenticated ? (
          <Button asChild>
            <Link href={appRoutes.profile._self.path}>View profile</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={appRoutes.auth.login._self.path}>Sign in</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href={appRoutes.home._self.path}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
