import { AppHeader } from "@/components/layout/app-header";
import { RequireAuthLayout } from "@/features/auth/utils/require-auth-layout";

/** Layout for authenticated app routes with header and footer */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuthLayout>
      <AppHeader />
      <div className="flex flex-1 flex-col">{children}</div>
    </RequireAuthLayout>
  );
}
