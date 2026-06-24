import { appEnv } from "@/lib/utils/env";

/** Application-wide constants */
export const APP_NAME = appEnv.appName;

/** localStorage key for the JWT access token */
export const ACCESS_TOKEN_KEY = "twothmatch_access_token";

/** localStorage key for cached user snapshot */
export const USER_SNAPSHOT_KEY = "twothmatch_user";
