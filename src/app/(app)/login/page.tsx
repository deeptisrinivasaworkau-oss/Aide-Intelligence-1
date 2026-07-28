import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Aide Intelligence demonstration workspace.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <AppHeader />
      <div className="intake-wrap intake-wrap-narrow">
        <LoginForm />
      </div>
    </>
  );
}
