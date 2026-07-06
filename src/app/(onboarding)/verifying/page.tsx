import {
  Loading01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifying",
};

/** Profile verification placeholder — functionality added in follow-up */
export default function VerifyingPage() {
  return (
    <main className="flex h-dvh flex-1 items-center justify-center p-8">
      <div className="relative flex flex-col gap-2 items-center max-w-80">
        <div className="flex items-center justify-center h-24 w-24 bg-primary/20 rounded-full">
          <HugeiconsIcon
            icon={Loading01Icon}
            className="size-12 fill-background text-primary motion-safe:animate-[spin_2s_ease-in-out_infinite] my-8"
          />
        </div>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          VERIFYING
        </p>
        <p className="text-sm text-muted-foreground text-center">
          We are verifying your details. This won't take long. We will send you
          an email once we are done.
        </p>
      </div>
    </main>
  );
}
