const DEVICE_ID_KEY = "twothmatch_device_id";

/**
 * Stable identifier for this browser on this site origin.
 *
 * Generated once with `crypto.randomUUID()`, stored in `localStorage`, and
 * reused on every visit. It is unique per browser profile (Chrome ≠ Safari,
 * normal ≠ incognito) and resets if the user clears site data.
 *
 * Browsers do not expose a true hardware device ID — this is the standard
 * web substitute for mobile `deviceId` / push token registration.
 */
export function getBrowserDeviceId(): string {
  if (typeof window === "undefined") return "";

  const existing = localStorage.getItem(DEVICE_ID_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `web-${crypto.randomUUID()}`
      : `web-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  localStorage.setItem(DEVICE_ID_KEY, id);
  return id;
}

/**
 * Device fields for auth requests from the web app.
 *
 * There is no real FCM token in the browser until Firebase Web Push is wired
 * up, so `fcmToken` is set to the same stable browser ID so the backend can
 * register and target this client consistently.
 */
export function getWebDevicePayload() {
  const deviceId = getBrowserDeviceId();

  return {
    fcmToken: deviceId,
    deviceId,
    deviceType: "web" as const,
  };
}
