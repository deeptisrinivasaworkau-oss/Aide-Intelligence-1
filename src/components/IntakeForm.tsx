"use client";

import { useState } from "react";
import Link from "next/link";
import { INTAKE_STORAGE_KEY } from "@/lib/intake";

const TOOLS = ["Gmail", "Google Drive", "Slack", "Calendar", "Other"];
const DEFAULT_TOOLS = ["Gmail", "Google Drive"];

export default function IntakeForm() {
  const [tools, setTools] = useState<string[]>(DEFAULT_TOOLS);
  const [done, setDone] = useState(false);

  const toggleTool = (tool: string) =>
    setTools((current) =>
      current.includes(tool)
        ? current.filter((t) => t !== tool)
        : [...current, tool],
    );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Kept client-side only so the dashboard can personalise itself.
    // Nothing is sent anywhere.
    try {
      localStorage.setItem(
        INTAKE_STORAGE_KEY,
        JSON.stringify({
          name: String(data.get("name") ?? "").trim(),
          company: String(data.get("company") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          ask: String(data.get("ask") ?? "").trim(),
          tools,
        }),
      );
    } catch {
      // Storage can be unavailable (private mode, blocked cookies) — the
      // dashboard falls back to a generic greeting.
    }

    setDone(true);
  };

  if (done) {
    return (
      <div className="intake-done">
        <h2>Got it.</h2>
        <p>Now connect the tools you want tracked and see your live dashboard.</p>
        <Link className="button" href="/dashboard">
          Continue to Dashboard <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1>Tell us what matters to you</h1>
      <p className="intake-lead">A quick intake — what you want tracked and why.</p>

      <form className="intake-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="intake-name">Your name</label>
          <input id="intake-name" name="name" type="text" autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="intake-company">Company</label>
          <input
            id="intake-company"
            name="company"
            type="text"
            autoComplete="organization"
          />
        </div>
        <div>
          <label htmlFor="intake-email">Your email</label>
          <input
            id="intake-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div>
          <span className="intake-chips-label">Which tools do you want tracked?</span>
          <div className="intake-chips" style={{ marginTop: 7 }}>
            {TOOLS.map((tool) => (
              <button
                key={tool}
                type="button"
                className="intake-chip"
                aria-pressed={tools.includes(tool)}
                onClick={() => toggleTool(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="intake-ask">
            What do you want to know at a glance? (your &ldquo;ask&rdquo;)
          </label>
          <textarea
            id="intake-ask"
            name="ask"
            required
            placeholder="e.g. Flag anything urgent from clients, summarize what changed in Drive overnight, tell me what I missed in Slack..."
          />
        </div>

        <button className="intake-submit" type="submit">
          Continue to dashboard
        </button>
      </form>

      <p className="intake-note">
        No account or activity data is collected here — this just tailors your
        dashboard.
      </p>
    </>
  );
}
