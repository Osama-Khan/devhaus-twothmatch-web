"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth";

/** Authenticated profile view backed by `/profile/me` hydration */
export function ProfileView() {
  const { isLoading } = useRequireAuth();
  const { user, logout } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const displayName = user.fullName ?? user.email;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Your account from the external API
        </p>
      </div>

      <Separator />

      <dl className="flex flex-col gap-4 text-sm">
        <div>
          <dt className="text-muted-foreground">Name</dt>
          <dd className="font-medium">{displayName}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium">{user.email || "—"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd className="font-medium capitalize">{user.role}</dd>
        </div>
        {user.completionPercent !== undefined && (
          <div>
            <dt className="text-muted-foreground">Profile completion</dt>
            <dd className="font-medium">{user.completionPercent}%</dd>
          </div>
        )}
        {user.isProfileVerified !== undefined && (
          <div>
            <dt className="text-muted-foreground">Verified</dt>
            <dd className="font-medium">
              {user.isProfileVerified ? "Yes" : "No"}
            </dd>
          </div>
        )}
      </dl>

      <Button variant="outline" onClick={() => void logout()}>
        Sign out
      </Button>
    </div>
  );
}
