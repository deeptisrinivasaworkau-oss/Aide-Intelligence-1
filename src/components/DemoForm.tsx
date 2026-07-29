"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DemoForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Was posting to /__forms.html for Netlify Forms, which returns 405 on
    // Vercel — every submission was being lost. Now goes to the same store as
    // the Try Aide page.
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          organisation: formData.get("organisation"),
          message: formData.get("message"),
          source: "demonstration-request",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? `Request failed: ${response.status}`);
      }
      router.push("/thank-you");
    } catch (err) {
      setError(
        (err as Error).message === "not_configured"
          ? "This form isn't connected to a database yet, so your request was not saved."
          : "The request could not be submitted. Please try again, or contact us directly.",
      );
      setSubmitting(false);
    }
  };

  return (
    <form className="demo-form" name="demonstration-request" onSubmit={handleSubmit}>
      <input type="hidden" name="form-name" value="demonstration-request" />
      <p className="honeypot">
        <label>
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>
      <label>
        Full name *<input name="name" autoComplete="name" required />
      </label>
      <label>
        Work email *
        <input type="email" name="email" autoComplete="email" required />
      </label>
      <label>
        Organisation *
        <input name="organisation" autoComplete="organization" required />
      </label>
      <label>
        Role<input name="role" autoComplete="organization-title" />
      </label>
      <label className="full">
        What would you like to understand more clearly?
        <textarea
          name="message"
          rows={5}
          placeholder="Briefly describe your operational priorities or questions."
        />
      </label>
      <label className="consent full">
        <input type="checkbox" name="contact-consent" required />
        <span>
          I agree to be contacted about Aide Intelligence and this demonstration
          request. *
        </span>
      </label>
      <div className="full form-submit">
        <p>
          {error ??
            "We will use your details only to respond to this request and related business communications."}
        </p>
        <button className="button" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Request"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
