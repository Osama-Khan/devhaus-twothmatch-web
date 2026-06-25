import Image from "next/image";
import { AuthSidePanel } from "@/features/auth/components/auth-side-panel";

type AuthSplitLayoutProps = {
  children: React.ReactNode;
};

/** Full-viewport split layout for auth pages — 50/50 on desktop, form-only on mobile. */
export function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-svh w-full">
      <AuthSidePanel />

      <div className="flex w-full flex-1 flex-col items-center justify-center bg-background px-4 py-10 sm:px-8 lg:w-1/2">
        <Image
          src="/img/logo-wd.svg"
          alt="Twoth Match"
          width={234}
          height={51}
          priority
          className="mb-8 h-auto w-[180px] sm:w-[234px]"
        />

        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
