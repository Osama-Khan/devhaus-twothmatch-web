"use client";

import Link from "next/link";
import { appRoutes } from "@/lib/routes";
import { APP_NAME } from "@/lib/constants/app";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

type AuthLayoutProps = {
  children: React.ReactNode;
};

/** Centered layout for login and registration pages */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-4">
        <Link
          href={appRoutes.home._self.path}
          className="text-sm font-semibold"
        >
          {APP_NAME}
        </Link>
        <ThemeSwitcher />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
