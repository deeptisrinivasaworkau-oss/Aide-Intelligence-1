import { NextResponse } from "next/server";

// Relays an allow-listed set of Slack Web API calls from the browser. Stores
// nothing — the user's token passes through on each call and is never kept.

const ALLOWED_ENDPOINTS = new Set([
  "conversations.list",
  "conversations.history",
  "users.info",
  "auth.test",
]);

export async function POST(request: Request) {
  let body: { token?: string; endpoint?: string; params?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const { token, endpoint, params } = body;
  if (!token || !endpoint || !ALLOWED_ENDPOINTS.has(endpoint)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  try {
    const search = new URLSearchParams(params ?? {});
    const slackRes = await fetch(
      `https://slack.com/api/${endpoint}?${search.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return NextResponse.json(await slackRes.json());
  } catch {
    return NextResponse.json({ ok: false, error: "proxy_error" }, { status: 500 });
  }
}
