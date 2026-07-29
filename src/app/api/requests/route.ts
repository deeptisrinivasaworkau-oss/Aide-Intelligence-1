import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

/**
 * Stores enquiries from the Try Aide page and the demonstration form.
 *
 * Vercel's filesystem is ephemeral, so submissions have to go to a real
 * datastore — this uses Postgres via DATABASE_URL. Without that variable the
 * route reports "not_configured" and the form tells the visitor plainly rather
 * than pretending the request was received.
 */

type Payload = {
  name?: string;
  email?: string;
  organisation?: string;
  message?: string;
  source?: string;
};

const LIMITS: Record<keyof Payload, number> = {
  name: 200,
  email: 320,
  organisation: 200,
  message: 5000,
  source: 40,
};

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return NextResponse.json(
      { error: "not_configured", message: "No database is connected yet." },
      { status: 503 },
    );
  }

  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const row = {
    name: clean(body.name, LIMITS.name),
    email: clean(body.email, LIMITS.email),
    organisation: clean(body.organisation, LIMITS.organisation),
    message: clean(body.message, LIMITS.message),
    source: clean(body.source, LIMITS.source) || "unknown",
  };

  // No field is individually required, but a submission with nothing in it at
  // all is noise rather than a lead.
  if (!row.name && !row.email && !row.organisation && !row.message) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  try {
    const sql = neon(url);
    // Created on demand so there's no separate migration step to forget.
    await sql`
      CREATE TABLE IF NOT EXISTS requests (
        id           bigserial PRIMARY KEY,
        created_at   timestamptz NOT NULL DEFAULT now(),
        name         text,
        email        text,
        organisation text,
        message      text,
        source       text
      )
    `;
    await sql`
      INSERT INTO requests (name, email, organisation, message, source)
      VALUES (${row.name}, ${row.email}, ${row.organisation}, ${row.message}, ${row.source})
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("request store failed", error);
    return NextResponse.json({ error: "store_failed" }, { status: 500 });
  }
}
