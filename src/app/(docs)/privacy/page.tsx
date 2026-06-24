import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

/** Static privacy policy placeholder */
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        Privacy policy content will be added here.
      </p>
    </article>
  );
}
