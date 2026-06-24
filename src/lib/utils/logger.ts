type LogLevel = "debug" | "info" | "warn" | "error";

type Logger = {
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  child: (namespace: string) => Logger;
};

/* eslint-disable no-console -- structured logging utility */
function log(
  level: LogLevel,
  namespace: string,
  message: string,
  meta?: Record<string, unknown>
): void {
  const prefix = `[${namespace}]`;
  const payload = meta ? { message, ...meta } : message;

  switch (level) {
    case "debug":
      if (process.env.NODE_ENV !== "production") {
        console.debug(prefix, payload);
      }
      break;
    case "info":
      console.info(prefix, payload);
      break;
    case "warn":
      console.warn(prefix, payload);
      break;
    case "error":
      console.error(prefix, payload);
      break;
  }
}

function createLogger(namespace: string): Logger {
  return {
    debug: (message, meta) => log("debug", namespace, message, meta),
    info: (message, meta) => log("info", namespace, message, meta),
    warn: (message, meta) => log("warn", namespace, message, meta),
    error: (message, meta) => log("error", namespace, message, meta),
    child: (childNamespace) => createLogger(`${namespace}:${childNamespace}`),
  };
}

/** Root application logger — use `.child("FeatureName")` for namespaced logs */
export const logger = createLogger("TwothMatch");
