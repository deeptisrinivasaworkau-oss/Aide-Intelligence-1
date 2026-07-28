"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { endDemoSession, hasDemoSession } from "@/lib/auth";

/** Only rendered once a demo session exists, so it can't appear on /login. */
export default function SignOutLink() {
  const router = useRouter();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted || !hasDemoSession()) return null;

  return (
    <button
      className="app-back app-signout"
      type="button"
      onClick={() => {
        endDemoSession();
        router.push("/login");
      }}
    >
      Sign out
    </button>
  );
}
