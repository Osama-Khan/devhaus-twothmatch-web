import type {
  NominatimPlace,
  NominatimReverseResult,
  NominatimSearchResult,
} from "@/features/location/types/nominatim";

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";
const NOMINATIM_REVERSE_URL = "https://nominatim.openstreetmap.org/reverse";

/** Maps Nominatim API rows into app place objects */
export function mapNominatimResults(
  results: NominatimSearchResult[]
): NominatimPlace[] {
  return results
    .map((result) => {
      const latitude = Number(result.lat);
      const longitude = Number(result.lon);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
      }

      return {
        placeId: String(result.place_id),
        label: result.display_name,
        latitude,
        longitude,
      };
    })
    .filter((place): place is NominatimPlace => place != null);
}

function mapReverseResult(result: NominatimReverseResult): NominatimPlace | null {
  const latitude = Number(result.lat);
  const longitude = Number(result.lon);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    placeId: String(result.place_id),
    label: result.display_name,
    latitude,
    longitude,
  };
}

/** Search places via Nominatim (client-side) */
export async function searchNominatimPlaces(
  query: string
): Promise<NominatimPlace[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3 || typeof window === "undefined") {
    return [];
  }

  const params = new URLSearchParams({
    q: trimmed,
    format: "json",
    addressdetails: "1",
    limit: "8",
  });

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`);

  if (!response.ok) {
    return [];
  }

  const results = (await response.json()) as NominatimSearchResult[];
  return mapNominatimResults(results);
}

/** Reverse geocode coordinates via Nominatim (client-side) */
export async function reverseNominatimPlace(
  latitude: number,
  longitude: number
): Promise<NominatimPlace | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: "json",
    addressdetails: "1",
  });

  const response = await fetch(`${NOMINATIM_REVERSE_URL}?${params.toString()}`);

  if (!response.ok) {
    return null;
  }

  const result = (await response.json()) as NominatimReverseResult;
  return mapReverseResult(result);
}
