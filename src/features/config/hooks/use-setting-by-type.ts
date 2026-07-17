"use client";

import { useEffect, useState } from "react";
import { settingsService } from "@/features/config/services/settings-service";
import type { MetadataItem } from "@/features/config/types/metadata-response";
import type { SettingType } from "@/features/config/types/setting-type";

type UseSettingByTypeResult = {
  items: MetadataItem[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

/**
 * Fetches public app setting rows for a known settings key.
 * Pass `enabled: false` to skip the request (e.g. while a dialog is closed).
 */
export function useSettingByType(
  type: SettingType,
  enabled = true
): UseSettingByTypeResult {
  const [items, setItems] = useState<MetadataItem[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void settingsService.getByType(type).then((response) => {
      if (cancelled) {
        return;
      }

      if ("error" in response) {
        setItems([]);
        setError(response.error);
      } else {
        setItems(response.data.items);
      }

      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [type, enabled]);

  return {
    items,
    isLoading,
    isReady: !isLoading,
    error,
  };
}
