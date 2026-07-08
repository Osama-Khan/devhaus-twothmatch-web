"use client";

import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth";

/** Authenticated profile view backed by GET `/profile` hydration */
export function ProfileView() {
  const { isLoading } = useRequireAuth();
  const { user } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const displayName = user.fullName ?? user.email;

  return (
    <main className="mx-auto h-full min-h-0 w-full max-w-2xl overflow-y-auto px-4 py-8">
      <div className="rounded-3xl bg-card p-6 ring-1 ring-border">
        <div>
          <h1 className="text-base font-bold text-foreground">Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your profile information.
          </p>
        </div>

        <Separator className="my-4" />

        <dl className="flex flex-col gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium text-foreground">{displayName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium text-foreground">{user.email || "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-medium capitalize text-foreground">
              {user.role}
            </dd>
          </div>
          {user.completionPercent !== undefined && (
            <div>
              <dt className="text-muted-foreground">Profile completion</dt>
              <dd className="font-medium text-foreground">
                {user.completionPercent}%
              </dd>
            </div>
          )}
          {user.isProfileVerified !== undefined && (
            <div>
              <dt className="text-muted-foreground">Verified</dt>
              <dd className="font-medium text-foreground">
                {user.isProfileVerified ? "Yes" : "No"}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </main>
  );
}
