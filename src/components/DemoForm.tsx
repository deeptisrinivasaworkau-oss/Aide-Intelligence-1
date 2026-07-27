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

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as string[][]).toString(),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      router.push("/thank-you");
    } catch {
      setError(
        "The request could not be submitted. Please try again, or contact us directly.",
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
