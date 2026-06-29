type CoordinatesValue = {
  latitude: number | null;
  longitude: number | null;
};

/** Whether a location has usable map coordinates */
export function hasCoordinates(value: CoordinatesValue): boolean {
  return (
    value.latitude != null &&
    value.longitude != null &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude)
  );
}
