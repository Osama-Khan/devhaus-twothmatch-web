"use client";

import type { ConfigType } from "@/features/config/types/config-type";
import type { ConfigByTypeResponse } from "@/features/config/types/metadata-response";
import type { AppResponseType } from "@/lib/types/response";
import { externalApiRoutes } from "@/lib/routes";
import { apiFetcher } from "@/lib/services/api-fetcher";

function configByTypePath(type: ConfigType): string {
  return `${externalApiRoutes.config.byType._self.path}/${type}`;
}

/**
 * Client-side config metadata service. No auth required.
 */
export const configService = {
  /** GET `/config/{type}` — returns metadata rows for a known config key */
  getByType(type: ConfigType): Promise<AppResponseType<ConfigByTypeResponse>> {
    return apiFetcher.get<ConfigByTypeResponse>(configByTypePath(type), {
      skipAuth: true,
    });
  },
};
