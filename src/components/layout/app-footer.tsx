import Link from "next/link";
import { appRoutes } from "@/lib/routes";
import { APP_NAME } from "@/lib/constants/app";

/** Site footer shared across layouts */
export function AppFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {APP_NAME}
        </p>
        <nav className="flex gap-4">
          <Link
            href={appRoutes.docs.privacy._self.path}
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href={appRoutes.home._self.path}
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
        </nav>
      </div>
    </footer>
  );
}
