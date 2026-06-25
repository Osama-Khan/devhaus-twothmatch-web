import type { Metadata } from "next";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <RegisterForm />
    </AuthSplitLayout>
  );
}
