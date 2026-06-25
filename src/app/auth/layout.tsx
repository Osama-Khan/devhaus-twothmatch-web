import { RedirectIfAuthenticated } from "@/features/auth/utils/redirect-if-authenticated";

/** Auth pages layout with redirect guard for signed-in users */
export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>;
}
