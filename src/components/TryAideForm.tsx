"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "unconfigured" | "error";

export default function TryAideForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          organisation: data.get("organisation"),
          role: data.get("role"),
          message: data.get("message"),
          source: "try-aide",
        }),
      });
      const payload = await res.json().catch(() => ({}));

      if (res.ok) setStatus("sent");
      else if (payload.error === "not_configured") setStatus("unconfigured");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="try-done">
        <h2>Request received.</h2>
        <p>
          We&rsquo;ll be in touch. If it&rsquo;s urgent, reply to the address you
          normally reach us on.
        </p>
      </div>
    );
  }

  return (
    <form className="try-form" onSubmit={handleSubmit}>
      {/* Nothing here is required — a visitor can send just a sentence. */}
      <div className="try-row">
        <label className="try-field">
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" />
        </label>
        <label className="try-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" />
        </label>
      </div>

      <div className="try-row">
        <label className="try-field">
          <span>Organisation</span>
          <input name="organisation" type="text" autoComplete="organization" />
        </label>
        <label className="try-field">
          <span>Role</span>
          <input
            name="role"
            type="text"
            autoComplete="organization-title"
            placeholder="Owner, COO, Operations"
          />
        </label>
      </div>

      <label className="try-field">
        <span>What would you like to know?</span>
        <textarea
          name="message"
          rows={6}
          placeholder="Tell us what you'd want Aide to surface — what you keep missing, what you check every morning, what you wish you knew sooner."
        />
      </label>

      <button className="try-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Submit request"}
      </button>

      {status === "unconfigured" && (
        <p className="try-note try-note-warn" role="alert">
          This form isn&rsquo;t connected to a database yet, so your request was
          not saved. Nothing has been sent.
        </p>
      )}
      {status === "error" && (
        <p className="try-note try-note-warn" role="alert">
          Something went wrong and your request wasn&rsquo;t saved. Please try
          again.
        </p>
      )}
      {status === "idle" && (
        <p className="try-note">
          No field is required. Send as much or as little as you like.
        </p>
      )}
    </form>
  );
}
