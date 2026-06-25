import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
}
