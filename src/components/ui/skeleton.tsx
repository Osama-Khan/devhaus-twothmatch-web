import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Pulse placeholder for loading content */
function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
