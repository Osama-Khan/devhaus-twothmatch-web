"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { LeafletMap } from "@/features/location/components/leaflet-map";
import { profileService } from "@/features/profile/services/profile-service";
import { isPracticeProfileResponse } from "@/features/profile/types/profile-get-response";
import type {
  CandidateFeedFilters,
  CandidateFeedTab,
} from "@/features/home/types/feed-candidates";
import { hasCoordinates } from "@/features/location/utils/has-coordinates";
import { isSuccessResponse } from "@/lib/types/response";
import { cn } from "@/lib/utils";

const WORKING_PATTERN_OPTIONS = [
  "Monday To Friday",
  "Day Shift",
  "Night Shift",
  "Overtime",
  "Weekend Availability",
  "Every Weekend",
] as const;

const LOCUM_PAY_MIN = 0;
const LOCUM_PAY_MAX = 501;
const PERMANENT_PAY_MIN = 1000;
const PERMANENT_PAY_MAX = 500001;
const RADIUS_MIN = 10;
const RADIUS_MAX = 500;
const DEFAULT_SEARCH_RADIUS = 50;
const MILES_TO_KM = 1.60934;

type ProfileCoordinates = {
  latitude: number;
  longitude: number;
};

type DraftFilters = {
  workingPattern: string | null;
  payRange: [number, number];
  searchRadius: number;
  committedSearchRadius: number;
  enableLocation: boolean;
  latitude: number | null;
  longitude: number | null;
};

type CandidateFeedFiltersButtonProps = {
  activeTab: CandidateFeedTab;
  value: CandidateFeedFilters | null;
  onChange: (filters: CandidateFeedFilters) => void;
};

function getPayBounds(activeTab: CandidateFeedTab) {
  return activeTab === "locum"
    ? { min: LOCUM_PAY_MIN, max: LOCUM_PAY_MAX, step: 1 }
    : { min: PERMANENT_PAY_MIN, max: PERMANENT_PAY_MAX, step: 1000 };
}

function createDraftFromValue(
  value: CandidateFeedFilters | null,
  activeTab: CandidateFeedTab,
  profileLocation: ProfileCoordinates | null
): DraftFilters {
  const bounds = getPayBounds(activeTab);

  return {
    workingPattern: value?.workingPattern ?? null,
    payRange: [
      value?.payRangeMin ?? bounds.min,
      value?.payRangeMax ?? bounds.max,
    ],
    searchRadius: value?.searchRadius ?? DEFAULT_SEARCH_RADIUS,
    committedSearchRadius: value?.searchRadius ?? DEFAULT_SEARCH_RADIUS,
    enableLocation:
      value?.latitude != null && value?.longitude != null,
    latitude: value?.latitude ?? profileLocation?.latitude ?? null,
    longitude: value?.longitude ?? profileLocation?.longitude ?? null,
  };
}

function formatPayValue(value: number, activeTab: CandidateFeedTab): string {
  if (activeTab === "locum" && value >= LOCUM_PAY_MAX) {
    return "Infinite";
  }

  if (activeTab === "permanent" && value >= PERMANENT_PAY_MAX) {
    return "Infinite";
  }

  if (activeTab === "locum") {
    return `£${value}`;
  }

  return `£${value.toLocaleString("en-GB")}`;
}

function buildAppliedFilters(
  draft: DraftFilters,
  activeTab: CandidateFeedTab
): CandidateFeedFilters {
  const filters: CandidateFeedFilters = {};
  const bounds = getPayBounds(activeTab);
  const [payMin, payMax] = draft.payRange;

  if (draft.workingPattern) {
    filters.workingPattern = draft.workingPattern;
  }

  if (payMin > bounds.min) {
    filters.payRangeMin = payMin;
  }

  if (payMax < bounds.max) {
    filters.payRangeMax = payMax;
  }

  if (
    draft.enableLocation &&
    draft.latitude != null &&
    draft.longitude != null
  ) {
    filters.searchRadius = draft.searchRadius;
    filters.latitude = draft.latitude;
    filters.longitude = draft.longitude;
  }

  return filters;
}

/** Filter icon button with popover for candidate feed search filters */
export function CandidateFeedFiltersButton({
  activeTab,
  value,
  onChange,
}: CandidateFeedFiltersButtonProps) {
  const [open, setOpen] = useState(false);
  const [profileLocation, setProfileLocation] =
    useState<ProfileCoordinates | null>(null);
  const [draft, setDraft] = useState<DraftFilters>(() =>
    createDraftFromValue(value, activeTab, null)
  );
  const previousActiveTabRef = useRef(activeTab);

  const payBounds = getPayBounds(activeTab);
  const hasLocation = hasCoordinates({
    latitude: draft.latitude,
    longitude: draft.longitude,
  });

  // Set location to GPS if no locaation available
  useEffect(() => {
    if (draft.latitude == null || draft.longitude == null) {
      navigator.geolocation.getCurrentPosition((position) => {
        setDraft((current) => ({ ...current, latitude: position.coords.latitude, longitude: position.coords.longitude }));
      });
    }
  }, [draft.latitude, draft.longitude]);

  useEffect(() => {
    let cancelled = false;

    void profileService.getProfile().then((response) => {
      if (cancelled || !isSuccessResponse(response)) {
        return;
      }

      if (!isPracticeProfileResponse(response.data)) {
        return;
      }

      const location = response.data.locations[0];
      if (!location) {
        return;
      }

      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return;
      }

      setProfileLocation({ latitude, longitude });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!profileLocation) {
      return;
    }

    setDraft((current) => {
      if (current.latitude != null && current.longitude != null) {
        return current;
      }

      return {
        ...current,
        latitude: profileLocation.latitude,
        longitude: profileLocation.longitude,
      };
    });
  }, [profileLocation]);

  useEffect(() => {
    if (!open) {
      previousActiveTabRef.current = activeTab;
      return;
    }

    if (previousActiveTabRef.current === activeTab) {
      return;
    }

    previousActiveTabRef.current = activeTab;
    const bounds = getPayBounds(activeTab);
    setDraft((current) => ({
      ...current,
      payRange: [bounds.min, bounds.max],
    }));
  }, [activeTab, open]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setDraft(createDraftFromValue(value, activeTab, profileLocation));
      }

      setOpen(nextOpen);
    },
    [activeTab, profileLocation, value]
  );

  const handleApply = () => {
    onChange(buildAppliedFilters(draft, activeTab));
    setOpen(false);
  };

  const payLabel =
    activeTab === "locum"
      ? `${formatPayValue(draft.payRange[0], activeTab)} - ${formatPayValue(draft.payRange[1], activeTab)} per hour`
      : `${formatPayValue(draft.payRange[0], activeTab)} - ${formatPayValue(draft.payRange[1], activeTab)}`;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          type="button"
          className="border-none text-foreground"
          aria-label="Filter feed"
        >
          <HugeiconsIcon icon={FilterHorizontalIcon} strokeWidth={2} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[min(24rem,calc(100vw-2rem))] gap-0 p-0 min-h-0"
      >
        <div className="border-b border-border px-4 py-3">
          <PopoverTitle className="text-base font-semibold text-foreground">
            Search Filters
          </PopoverTitle>
        </div>

        <ScrollArea viewportClassName="max-h-96">
          <div className="flex flex-col gap-6 px-4 py-4">
            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                Preferred Working Pattern
              </h3>
              <div className="flex flex-wrap gap-2">
                {WORKING_PATTERN_OPTIONS.map((pattern) => {
                  const isSelected = draft.workingPattern === pattern;

                  return (
                    <button
                      key={pattern}
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          workingPattern: isSelected ? null : pattern,
                        }))
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      )}
                    >
                      {pattern}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">
                {activeTab === "locum" ? "Hourly Pay Range" : "Annual Pay Range"}
              </h3>
              <p className="text-center text-sm font-semibold text-primary">
                {payLabel}
              </p>
              <Slider
                min={payBounds.min}
                max={payBounds.max}
                step={payBounds.step}
                value={draft.payRange}
                onValueChange={(nextValue) =>
                  setDraft((current) => ({
                    ...current,
                    payRange: [nextValue[0] ?? payBounds.min, nextValue[1] ?? payBounds.max],
                  }))
                }
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatPayValue(payBounds.min, activeTab)}</span>
                <span>Infinite</span>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Location
                </h3>
                <Switch
                  checked={draft.enableLocation}
                  onCheckedChange={(enableLocation) =>
                    setDraft((current) => ({
                      ...current,
                      enableLocation,
                    }))
                  }
                  aria-label="Filter by location"
                />
              </div>

              <Collapsible open={draft.enableLocation}>
                <CollapsibleContent className="flex flex-col gap-6">
                  {hasLocation ? (
                    <>
                      <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-semibold text-foreground">
                          Search Radius
                        </h4>
                        <p className="text-center text-sm font-semibold text-primary">
                          {draft.searchRadius} Miles
                        </p>
                        <Slider
                          min={RADIUS_MIN}
                          max={RADIUS_MAX}
                          step={1}
                          value={[draft.searchRadius]}
                          onValueChange={(nextValue) =>
                            setDraft((current) => ({
                              ...current,
                              searchRadius: nextValue[0] ?? RADIUS_MIN,
                            }))
                          }
                          onValueCommit={(nextValue) =>
                            setDraft((current) => ({
                              ...current,
                              committedSearchRadius: nextValue[0] ?? RADIUS_MIN,
                            }))
                          }
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{RADIUS_MIN} miles</span>
                          <span>{RADIUS_MAX} miles</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <LeafletMap
                          latitude={draft.latitude!}
                          longitude={draft.longitude!}
                          radiusKm={draft.committedSearchRadius * MILES_TO_KM}
                          interactive
                          scrollWheelZoom
                          onCoordinatesChange={({ latitude, longitude }) =>
                            setDraft((current) => ({
                              ...current,
                              latitude,
                              longitude,
                            }))
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Click the map to move your search pin.
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Loading location...
                    </p>
                  )}
                </CollapsibleContent>
              </Collapsible>
            </section>
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4">
          <Button type="button" className="w-full" onClick={handleApply}>
            Apply Filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
