/**
 * Demo-only sign-in.
 *
 * This is NOT authentication. There is no account, no server check and no
 * password verification — any credentials are accepted, and the "session" is a
 * flag in localStorage that anyone can set from their browser console. It
 * exists so the product can be walked through in a realistic order during a
 * demo. Replace it with a real auth provider before anything sensitive sits
 * behind it.
 *
 * The password is never stored, transmitted, or logged.
 */

export const DEMO_SESSION_KEY = "aide-demo-session";

export type DemoSession = { email: string; signedInAt: number };

export function readDemoSession(): DemoSession | null {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoSession;
    return parsed.email ? parsed : null;
  } catch {
    return null;
  }
}

export function hasDemoSession(): boolean {
  return readDemoSession() !== null;
}

/** Records only the email — the password is discarded, never persisted. */
export function startDemoSession(email: string) {
  try {
    localStorage.setItem(
      DEMO_SESSION_KEY,
      JSON.stringify({ email, signedInAt: Date.now() } satisfies DemoSession),
    );
  } catch {
    // Storage unavailable (private mode) — the gate simply won't hold.
  }
}

export function endDemoSession() {
  try {
    localStorage.removeItem(DEMO_SESSION_KEY);
  } catch {
    // Nothing to clean up if storage is unavailable.
  }
}
