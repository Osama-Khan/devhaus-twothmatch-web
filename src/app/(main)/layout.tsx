import { AppHeader } from "@/components/layout/app-header";
import { RequireAuthLayout } from "@/features/auth/utils/require-auth-layout";
import { ChatSocketConnector } from "@/features/chat/components/chat-socket-connector";

/** Layout for authenticated app routes with header and footer */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuthLayout>
      <ChatSocketConnector />
      <div className="flex flex-col h-dvh overflow-hidden">
        <AppHeader />
        <div className="flex flex-1 flex-col min-h-0 overflow-hidden">{children}</div>
      </div>
    </RequireAuthLayout>
  );
}
