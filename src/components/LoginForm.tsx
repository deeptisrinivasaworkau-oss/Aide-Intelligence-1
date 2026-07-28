"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { startDemoSession } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email) return;

    // The password field is intentionally never read. Nothing is verified.
    setSubmitting(true);
    startDemoSession(email);
    router.push("/get-started");
  };

  return (
    <>
      <h1>Sign in</h1>
      <p className="intake-lead">
        Continue to your Aide Intelligence workspace.
      </p>

      <p className="demo-banner" role="note">
        <strong>Demonstration sign-in.</strong> Any email and password will work.
        No account is created and no password is stored or sent anywhere.
      </p>

      <form className="intake-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email">Work email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
          />
        </div>
        <div>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="off"
            placeholder="Anything at all"
            required
          />
        </div>

        <button className="intake-submit" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="intake-note">
        This demonstration gate is not a security control. Replace it with a real
        authentication provider before putting customer data behind it.
      </p>
    </>
  );
}
