"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { HugeiconsIcon } from "@hugeicons/react";
import { Location01Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LeafletMap } from "@/features/location/components/leaflet-map";
import {
  reverseNominatimPlace,
  searchNominatimPlaces,
} from "@/features/location/services/nominatim-service";
import type { NominatimPlace } from "@/features/location/types/nominatim";
import { cn } from "@/lib/utils";

export type AddressLocationValue = {
  address: string;
  addressPlaceId: string;
  latitude: number | null;
  longitude: number | null;
};

type AddressLocationFieldProps = {
  value: AddressLocationValue;
  onChange: (value: AddressLocationValue) => void;
};

function hasCoordinates(value: AddressLocationValue): value is AddressLocationValue & {
  latitude: number;
  longitude: number;
} {
  return (
    value.latitude != null &&
    value.longitude != null &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude)
  );
}

/** Address input with Nominatim suggestions, geolocation, and map preview */
export function AddressLocationField({
  value,
  onChange,
}: AddressLocationFieldProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery] = useDebounceValue(value.address, 300);
  const [suggestions, setSuggestions] = useState<NominatimPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  useEffect(() => {
    let cancelled = false;

    async function loadSuggestions() {
      if (debouncedQuery.trim().length < 3) {
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const results = await searchNominatimPlaces(debouncedQuery);

      if (cancelled) {
        return;
      }

      setSuggestions(results);
      setIsSearching(false);
      setActiveSuggestionIndex(-1);
    }

    void loadSuggestions();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsSuggestionsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const applyPlace = (place: NominatimPlace) => {
    onChange({
      address: place.label,
      addressPlaceId: place.placeId,
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setSuggestions([]);
    setIsSuggestionsOpen(false);
    setActiveSuggestionIndex(-1);
  };

  const handleAddressChange = (address: string) => {
    onChange({
      address,
      addressPlaceId: "",
      latitude: null,
      longitude: null,
    });
    setIsSuggestionsOpen(true);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location detection is not supported in this browser.");
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const place = await reverseNominatimPlace(
          position.coords.latitude,
          position.coords.longitude
        );

        setIsDetectingLocation(false);

        if (!place) {
          toast.error("Could not resolve your current location.");
          return;
        }

        applyPlace(place);
      },
      () => {
        setIsDetectingLocation(false);
        toast.error("Unable to access your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSuggestionKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!isSuggestionsOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((index) =>
        index >= suggestions.length - 1 ? 0 : index + 1
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1
      );
      return;
    }

    if (event.key === "Enter" && activeSuggestionIndex >= 0) {
      event.preventDefault();
      const place = suggestions[activeSuggestionIndex];
      if (place) {
        applyPlace(place);
      }
      return;
    }

    if (event.key === "Escape") {
      setIsSuggestionsOpen(false);
    }
  };

  const showSuggestions =
    isSuggestionsOpen &&
    value.address.trim().length >= 3 &&
    (isSearching || suggestions.length > 0);

  return (
    <Field>
      <FieldLabel htmlFor="address">Address</FieldLabel>

      <div ref={containerRef} className="relative">
        <InputGroup>
          <InputGroupInput
            id="address"
            type="text"
            placeholder="Enter"
            autoComplete="off"
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
            aria-autocomplete="list"
            value={value.address}
            onChange={(event) => handleAddressChange(event.target.value)}
            onFocus={() => setIsSuggestionsOpen(true)}
            onKeyDown={handleSuggestionKeyDown}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Detect current location"
              disabled={isDetectingLocation}
              onClick={handleDetectLocation}
            >
              <HugeiconsIcon
                icon={Location01Icon}
                strokeWidth={2}
                className="text-primary"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>

        {showSuggestions ? (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-border bg-card py-1 shadow-lg"
          >
            {isSearching ? (
              <li className="px-4 py-2 text-sm text-muted-foreground">
                Searching...
              </li>
            ) : (
              suggestions.map((place, index) => (
                <li key={place.placeId} role="option" aria-selected={index === activeSuggestionIndex}>
                  <button
                    type="button"
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted/60",
                      index === activeSuggestionIndex && "bg-muted/60"
                    )}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applyPlace(place)}
                  >
                    {place.label}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      {hasCoordinates(value) ? (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Map</p>
          <LeafletMap
            latitude={value.latitude}
            longitude={value.longitude}
          />
        </div>
      ) : null}
    </Field>
  );
}
