"use client";

import Link from "next/link";
import { appRoutes } from "@/lib/routes";
import { APP_NAME } from "@/lib/constants/app";
import { useAuthSelector } from "@/lib/store/hooks";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Button } from "@/components/ui/button";

/** Top navigation bar for authenticated app routes */
export function AppHeader() {
  const { isAuthenticated, user, isLoading } = useAuthSelector();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href={appRoutes.main._self.path}
          className="text-sm font-semibold tracking-tight"
        >
          {APP_NAME}
        </Link>

        <nav className="flex items-center gap-2">
          {!isLoading && isAuthenticated && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={appRoutes.profile._self.path}>
                {user?.fullName ?? user?.email ?? "Profile"}
              </Link>
            </Button>
          )}
          {!isLoading && !isAuthenticated && (
            <Button size="sm" asChild>
              <Link href={appRoutes.auth.login._self.path}>Sign in</Link>
            </Button>
          )}
          <ThemeSwitcher />
        </nav>
      </div>
    </header>
  );
}
