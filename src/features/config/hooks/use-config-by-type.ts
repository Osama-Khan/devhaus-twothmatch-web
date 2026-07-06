"use client";

import { useEffect, useState } from "react";
import { configService } from "@/features/config/services/config-service";
import type { ConfigType } from "@/features/config/types/config-type";
import type { MetadataItem } from "@/features/config/types/metadata-response";

type UseConfigByTypeResult = {
  items: MetadataItem[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

/**
 * Fetches public config metadata rows for a known config key.
 */
export function useConfigByType(type: ConfigType): UseConfigByTypeResult {
  const [items, setItems] = useState<MetadataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    void configService.getByType(type).then((response) => {
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
  }, [type]);

  return {
    items,
    isLoading,
    isReady: !isLoading,
    error,
  };
}
