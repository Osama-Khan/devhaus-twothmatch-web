import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verifying",
};

/** Profile verification placeholder — functionality added in follow-up */
export default function VerifyingPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-8">
      <p className="text-2xl font-semibold tracking-tight text-foreground">
        VERIFYING
      </p>
    </main>
  );
}
