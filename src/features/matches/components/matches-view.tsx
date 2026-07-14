"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CrownIcon, FavouriteIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MatchListingCard } from "@/features/matches/components/match-listing-card";
import { MatchListingCardSkeleton } from "@/features/matches/components/match-listing-card-skeleton";
import { useMatches } from "@/features/matches/hooks/use-matches";
import { useAuthSelector } from "@/lib/store/hooks";
import { cn } from "@/lib/utils";

type MatchesTab = "matches" | "likes";

const TABS = [
  { id: "matches" as const, label: "Matches" },
  { id: "likes" as const, label: "Likes" },
];

type MatchesViewProps = {
  className?: string;
};

/** Authenticated matches page with Matches / Likes tabs */
export function MatchesView({ className }: MatchesViewProps) {
  const [activeTab, setActiveTab] = useState<MatchesTab>("matches");
  const { user } = useAuthSelector();

  const {
    matches,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  } = useMatches();

  const isMatchesTab = activeTab === "matches";

  return (
    <main className={cn("flex h-full min-h-0 w-full flex-col", className)}>
      <ScrollArea className="h-full w-full">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Matches
          </h1>

          <div className="mt-6">
            <PillTabs
              tabs={TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <section className="mt-6">
            {isMatchesTab ? (
              isLoading ? (
                <MatchListingCardSkeleton />
              ) : error && matches.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-12">
                  <p className="text-center text-sm text-destructive">{error}</p>
                  <Button type="button" variant="outline" onClick={refetch}>
                    Try again
                  </Button>
                </div>
              ) : matches.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <HugeiconsIcon
                    icon={CrownIcon}
                    strokeWidth={2}
                    className="size-14 text-primary"
                  />
                  <p className="text-center text-base font-medium text-muted-foreground">
                    No matches yet.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {matches.map((match) => (
                    <MatchListingCard
                      key={match.id}
                      match={match}
                      viewerRole={user?.role}
                    />
                  ))}

                  {error ? (
                    <p className="text-center text-sm text-destructive">
                      {error}
                    </p>
                  ) : null}

                  {hasMore ? (
                    <div className="flex justify-center pt-2">
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto py-0 text-sm font-semibold"
                        disabled={isLoadingMore}
                        onClick={loadMore}
                      >
                        {isLoadingMore ? "Loading…" : "Load more"}
                      </Button>
                    </div>
                  ) : null}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center gap-2 py-12">
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  strokeWidth={2}
                  className="size-14 text-primary"
                />
                <p className="text-center text-base font-medium text-muted-foreground">
                  Likes coming soon.
                </p>
              </div>
            )}
          </section>
        </div>
      </ScrollArea>
    </main>
  );
}
