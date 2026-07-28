"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { hasDemoSession } from "@/lib/auth";

/**
 * Sends visitors to /login unless the demo session flag is present.
 *
 * This is a demo gate, not a security boundary — the check runs in the browser
 * and is trivially bypassed. Do not put anything confidential behind it.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Only true after hydration, so the localStorage read can't desync SSR.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const signedIn = mounted && hasDemoSession();

  useEffect(() => {
    if (mounted && !signedIn) router.replace("/login");
  }, [mounted, signedIn, router]);

  if (!signedIn) return null;
  return <>{children}</>;
}
