import { NextResponse, type NextRequest } from "next/server";

// Exchanges a Slack OAuth "code" for an access token. This is the one step
// that cannot happen in browser JS, because it needs SLACK_CLIENT_SECRET.
//
// Nothing is stored: the token is relayed straight back to the browser in the
// redirect fragment and then forgotten.
//
// Requires SLACK_CLIENT_ID and SLACK_CLIENT_SECRET as environment variables.

function originOf(request: NextRequest) {
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  return `${proto}://${host}`;
}

function failure(origin: string, reason: string) {
  return NextResponse.redirect(
    `${origin}/dashboard#slack_error=${encodeURIComponent(reason)}`,
    302,
  );
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state") ?? "";
  const error = params.get("error");
  const origin = originOf(request);

  if (error) return failure(origin, error);
  if (!code) {
    return new NextResponse("Missing 'code' parameter.", { status: 400 });
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  if (!clientId || !clientSecret) return failure(origin, "not_configured");

  try {
    const slackRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: `${origin}/api/slack-oauth`,
      }),
    });
    const data = await slackRes.json();

    if (!data.ok) return failure(origin, data.error ?? "oauth_failed");

    const token = data.authed_user?.access_token;
    if (!token) return failure(origin, "no_user_token");

    const redirect =
      `${origin}/dashboard#slack_token=${encodeURIComponent(token)}` +
      `&slack_team=${encodeURIComponent(data.team?.name ?? "")}` +
      `&slack_team_id=${encodeURIComponent(data.team?.id ?? "")}` +
      `&state=${encodeURIComponent(state)}`;

    return NextResponse.redirect(redirect, 302);
  } catch {
    return failure(origin, "server_error");
  }
}
