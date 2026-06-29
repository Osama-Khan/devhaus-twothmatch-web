"use client";

import { useEffect, useRef, useState } from "react";
import type { Circle, CircleMarker, Map as LeafletMapInstance } from "leaflet";
import { cn } from "@/lib/utils";

type LeafletMapProps = {
  latitude: number;
  longitude: number;
  radiusKm?: number | null;
  heightClass?: string;
  zoom?: number;
  scrollWheelZoom?: boolean;
  interactive?: boolean;
  onCoordinatesChange?: (coordinates: {
    latitude: number;
    longitude: number;
  }) => void;
};

/** OpenStreetMap preview powered by Leaflet */
export function LeafletMap({
  latitude,
  longitude,
  radiusKm,
  heightClass = "h-56",
  zoom = 13,
  scrollWheelZoom = false,
  interactive = false,
  onCoordinatesChange,
}: LeafletMapProps) {
  const mapRootRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markerLayerRef = useRef<CircleMarker | null>(null);
  const radiusLayerRef = useRef<Circle | null>(null);
  const onCoordinatesChangeRef = useRef(onCoordinatesChange);

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    onCoordinatesChangeRef.current = onCoordinatesChange;
  }, [onCoordinatesChange]);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      if (!mapRootRef.current) {
        return;
      }

      setMapReady(false);
      setMapError(null);

      try {
        const leaflet = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        if (cancelled || !mapRootRef.current) {
          return;
        }

        const L = leaflet.default;

        mapInstanceRef.current?.remove();
        mapInstanceRef.current = null;
        markerLayerRef.current = null;
        radiusLayerRef.current = null;

        const mapInstance = L.map(mapRootRef.current, {
          scrollWheelZoom,
        }).setView([latitude, longitude], zoom);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(mapInstance);

        const markerLayer = L.circleMarker([latitude, longitude], {
          radius: 8,
          color: "var(--primary)",
          fillColor: "var(--primary)",
          fillOpacity: 0.85,
          weight: 2,
        }).addTo(mapInstance);

        mapInstanceRef.current = mapInstance;
        markerLayerRef.current = markerLayer;

        if (radiusKm != null && radiusKm > 0) {
          radiusLayerRef.current = L.circle([latitude, longitude], {
            radius: radiusKm * 1000,
            color: "var(--primary)",
            fillColor: "var(--primary)",
            fillOpacity: 0.08,
            weight: 1,
          }).addTo(mapInstance);
          mapInstance.fitBounds(radiusLayerRef.current.getBounds(), {
            padding: [24, 24],
          });
        }

        if (interactive) {
          mapInstance.on("click", (event) => {
            const nextLatitude = event.latlng.lat;
            const nextLongitude = event.latlng.lng;
            markerLayer.setLatLng([nextLatitude, nextLongitude]);
            radiusLayerRef.current?.setLatLng([nextLatitude, nextLongitude]);
            onCoordinatesChangeRef.current?.({
              latitude: nextLatitude,
              longitude: nextLongitude,
            });
          });
        }

        mapInstance.invalidateSize();
        setMapReady(true);
      } catch (error) {
        if (!cancelled) {
          setMapError(
            error instanceof Error ? error.message : "Unable to load map"
          );
        }
      }
    }

    void initMap();

    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      markerLayerRef.current = null;
      radiusLayerRef.current = null;
    };
  }, [interactive, radiusKm, scrollWheelZoom, zoom]);

  useEffect(() => {
    const mapInstance = mapInstanceRef.current;
    const markerLayer = markerLayerRef.current;
    if (!mapInstance || !markerLayer) {
      return;
    }

    markerLayer.setLatLng([latitude, longitude]);

    if (radiusLayerRef.current) {
      radiusLayerRef.current.setLatLng([latitude, longitude]);
      mapInstance.fitBounds(radiusLayerRef.current.getBounds(), {
        padding: [24, 24],
      });
      return;
    }

    mapInstance.setView([latitude, longitude], zoom);
  }, [latitude, longitude, zoom]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-muted/30",
        heightClass,
        interactive && mapReady && "cursor-crosshair"
      )}
    >
      <div ref={mapRootRef} className="h-full w-full" />
      {mapError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 px-4 text-sm text-muted-foreground">
          {mapError}
        </div>
      ) : !mapReady ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-sm text-muted-foreground">
          Loading map...
        </div>
      ) : null}
    </div>
  );
}
