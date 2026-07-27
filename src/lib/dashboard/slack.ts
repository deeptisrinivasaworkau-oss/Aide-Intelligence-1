import type { SlackItem } from "./types";

export const SLACK_USER_SCOPES =
  "channels:history,channels:read,groups:history,groups:read,users:read";
export const SLACK_OAUTH_REDIRECT_PATH = "/api/slack-oauth";
const SLACK_PROXY_PATH = "/api/slack-proxy";

async function slackProxy(
  token: string,
  endpoint: string,
  params: Record<string, string>,
) {
  const res = await fetch(SLACK_PROXY_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, endpoint, params }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(data.error ?? "slack_api_error");
  return data;
}

export async function loadSlack(token: string): Promise<SlackItem[]> {
  const list = await slackProxy(token, "conversations.list", {
    types: "public_channel,private_channel",
    limit: "30",
    exclude_archived: "true",
  });

  const channels = ((list.channels ?? []) as { id: string; name: string }[]).slice(
    0,
    15,
  );

  const withHistory = await Promise.all(
    channels.map(async (channel) => {
      try {
        const history = await slackProxy(token, "conversations.history", {
          channel: channel.id,
          limit: "1",
        });
        const message = (history.messages ?? [])[0];
        if (!message) return null;
        return {
          channelId: channel.id,
          channelName: channel.name,
          text: message.text || "(no text)",
          ts: message.ts,
        };
      } catch {
        return null;
      }
    }),
  );

  return withHistory
    .filter((item): item is SlackItem => item !== null)
    .sort((a, b) => Number(b.ts) - Number(a.ts));
}

/** Channels with a message since midnight — drives the "Slack channels active" stat. */
export function countActiveToday(items: SlackItem[]): number {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return new Set(
    items
      .filter((item) => Number(item.ts) * 1000 > todayStart.getTime())
      .map((item) => item.channelId),
  ).size;
}

export function startSlackAuth(clientId: string) {
  const state = Math.random().toString(36).slice(2);
  sessionStorage.setItem("slack_oauth_state", state);
  const params = new URLSearchParams({
    client_id: clientId,
    user_scope: SLACK_USER_SCOPES,
    redirect_uri: window.location.origin + SLACK_OAUTH_REDIRECT_PATH,
    state,
  });
  window.location.href = `https://slack.com/oauth/v2/authorize?${params}`;
}

export type SlackRedirect =
  | { type: "token"; token: string; team: string; teamId: string }
  | { type: "error"; message: string };

/** Read the token (or error) Slack's OAuth handler put in the URL fragment. */
export function readSlackRedirect(): SlackRedirect | null {
  if (!window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const token = params.get("slack_token");
  const error = params.get("slack_error");
  if (!token && !error) return null;

  history.replaceState(null, "", window.location.pathname);

  if (error) return { type: "error", message: error };

  const expectedState = sessionStorage.getItem("slack_oauth_state");
  sessionStorage.removeItem("slack_oauth_state");
  const state = params.get("state");
  if (expectedState && state && expectedState !== state) {
    return { type: "error", message: "state mismatch, please try again" };
  }

  return {
    type: "token",
    token: token as string,
    team: params.get("slack_team") ?? "",
    teamId: params.get("slack_team_id") ?? "",
  };
}
