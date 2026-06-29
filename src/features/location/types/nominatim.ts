/** Normalized place result from Nominatim */
export type NominatimPlace = {
  placeId: string;
  label: string;
  latitude: number;
  longitude: number;
};

/** Raw Nominatim search API row */
export type NominatimSearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

/** Raw Nominatim reverse geocode API row */
export type NominatimReverseResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};
