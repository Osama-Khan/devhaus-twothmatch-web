import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appRoutes } from "@/lib/routes";
import { APP_NAME } from "@/lib/constants/app";

/** Marketing landing page content */
export function HomeView() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Welcome to {APP_NAME}
        </h1>
        <p className="text-lg text-muted-foreground">
          A feature-first Next.js frontend that authenticates against an
          external API using JWTs. Sign in to access the app.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" asChild>
          <Link href={appRoutes.auth.login._self.path}>Get started</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href={appRoutes.main._self.path}>Open app</Link>
        </Button>
      </div>
    </div>
  );
}
