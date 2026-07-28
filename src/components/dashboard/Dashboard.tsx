"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import {
  countRecentFiles,
  fetchMailBodies,
  GOOGLE_SCOPES,
  loadDrive,
  loadGoogleCalendar,
  loadMail,
} from "@/lib/dashboard/google";
import {
  loadMsCalendar,
  loadOneDrive,
  loadOutlook,
  MICROSOFT_AUTHORITY,
  MICROSOFT_SCOPES,
} from "@/lib/dashboard/microsoft";
import {
  countActiveToday,
  loadSlack,
  readSlackRedirect,
  startSlackAuth,
} from "@/lib/dashboard/slack";
import { initialPanel, type PanelState } from "@/lib/dashboard/types";
import type {
  EventItem,
  FileItem,
  MailItem,
  SlackItem,
} from "@/lib/dashboard/types";
import { readIntake } from "@/lib/intake";
import SignOutLink from "@/components/SignOutLink";
import {
  EventRows,
  FileRows,
  MailRows,
  Panel,
  SlackRows,
} from "./panels";
import * as Icon from "./icons";

import "@/styles/dashboard.css";

// OAuth *client IDs* are public by design — they ship in browser JS on every
// site that uses them. Client secrets never appear here; the Slack secret lives
// server-side in /api/slack-oauth. Override any of these per-deployment.
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  "743627935154-bgrspq92es88us1eihi88gmpic70pqes.apps.googleusercontent.com";
const SLACK_CLIENT_ID = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID ?? "";
const MICROSOFT_CLIENT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID ?? "";

type GoogleService = "gmail" | "calendar" | "drive";
type MicrosoftService = "outlook" | "calendar" | "onedrive";

/** True only after hydration — lets us read browser-only state without an SSR mismatch. */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function greetingFor(name: string) {
  const hour = new Date().getHours();
  const part =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${part}${name ? `, ${name}` : ""}.`;
}

export default function Dashboard() {
  const mounted = useMounted();

  const [openProvider, setOpenProvider] = useState<string | null>("google");
  const [googleReady, setGoogleReady] = useState(false);
  const [msalReady, setMsalReady] = useState(false);

  const [googleConnected, setGoogleConnected] = useState<Set<GoogleService>>(
    new Set(),
  );
  const [msConnected, setMsConnected] = useState<Set<MicrosoftService>>(new Set());
  const [msAccountLabel, setMsAccountLabel] = useState("");
  const [slackTeam, setSlackTeam] = useState<{ name: string; id: string } | null>(
    null,
  );
  const [slackError, setSlackError] = useState<string | null>(null);

  const googleToken = useRef<string | null>(null);
  const googleTokenClient = useRef<GoogleTokenClient | null>(null);
  const msalInstance = useRef<MsalPublicClientApplication | null>(null);
  const msToken = useRef<string | null>(null);
  const slackToken = useRef<string | null>(null);

  const [mail, setMail] = useState<PanelState<MailItem>>(initialPanel);
  const [gcal, setGcal] = useState<PanelState<EventItem>>(initialPanel);
  const [drive, setDrive] = useState<PanelState<FileItem>>(initialPanel);
  const [slack, setSlack] = useState<PanelState<SlackItem>>(initialPanel);
  const [outlook, setOutlook] = useState<PanelState<MailItem>>(initialPanel);
  const [mscal, setMscal] = useState<PanelState<EventItem>>(initialPanel);
  const [onedrive, setOnedrive] = useState<PanelState<FileItem>>(initialPanel);

  const [stats, setStats] = useState({
    unread: "–",
    important: "–",
    files: "–",
    slack: "–",
  });

  // Slack's OAuth handler returns the token in the URL fragment. Read it once,
  // on the first render after hydration, then strip it from the address bar.
  const slackRedirect = useRef(false);
  if (mounted && !slackRedirect.current) {
    slackRedirect.current = true;
    const redirect = readSlackRedirect();
    if (redirect?.type === "error") {
      setSlackError(redirect.message);
    } else if (redirect?.type === "token") {
      slackToken.current = redirect.token;
      setSlackTeam({ name: redirect.team, id: redirect.teamId });
    }
  }

  const intakeName = mounted ? (readIntake().name ?? "").split(" ")[0] : "";
  const heroDate = mounted
    ? `${new Date().toLocaleDateString(undefined, { weekday: "long" })} · ${new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`
    : "Executive Operations Overview";

  /* ---------------- Google ---------------- */

  const runGoogleService = useCallback(async (service: GoogleService) => {
    const token = googleToken.current;
    if (!token) return;
    setGoogleConnected((prev) => new Set(prev).add(service));

    if (service === "gmail") {
      setMail({ status: "loading", meta: "loading…", items: [] });
      try {
        const items = await loadMail(token);
        setMail({
          status: "ready",
          meta: `${items.length} threads shown`,
          items,
        });
        setStats((prev) => ({
          ...prev,
          unread: String(items.filter((i) => i.unread).length),
          important: String(items.filter((i) => i.important).length),
        }));

        // Then upgrade the heuristic lines with real AI summaries, if configured.
        if (items.length > 0) {
          setMail((prev) => ({
            ...prev,
            meta: `${items.length} threads shown · reading full emails…`,
          }));
          try {
            const emails = await fetchMailBodies(items, token);
            const res = await fetch("/api/summarize", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ emails }),
            });
            const data = await res.json();
            if (data.error === "not_configured") {
              setMail((prev) => ({
                ...prev,
                meta: `${items.length} threads shown · AI summaries off (add API key)`,
              }));
            } else if (Array.isArray(data.results) && data.results.length > 0) {
              setMail({
                status: "ready",
                meta: `${items.length} threads shown · AI summaries`,
                items: items.map((item, idx) => ({
                  ...item,
                  summaryLine: data.results[idx]?.summary ?? item.summaryLine,
                  verdict: data.results[idx]?.action ?? item.verdict,
                })),
              });
            } else {
              setMail((prev) => ({
                ...prev,
                meta: `${items.length} threads shown`,
              }));
            }
          } catch {
            setMail((prev) => ({ ...prev, meta: `${items.length} threads shown` }));
          }
        }
      } catch (error) {
        setMail({
          status: "error",
          meta: "error",
          items: [],
          error: `Could not load Gmail: ${(error as Error).message}`,
        });
      }
      return;
    }

    if (service === "calendar") {
      setGcal({ status: "loading", meta: "loading…", items: [] });
      try {
        const items = await loadGoogleCalendar(token);
        setGcal({ status: "ready", meta: `${items.length} upcoming`, items });
      } catch (error) {
        setGcal({
          status: "error",
          meta: "error",
          items: [],
          error: `Could not load calendar: ${(error as Error).message}`,
        });
      }
      return;
    }

    setDrive({ status: "loading", meta: "loading…", items: [] });
    try {
      const items = await loadDrive(token);
      setDrive({ status: "ready", meta: `${items.length} files shown`, items });
      setStats((prev) => ({ ...prev, files: String(countRecentFiles(items)) }));
    } catch (error) {
      setDrive({
        status: "error",
        meta: "error",
        items: [],
        error: `Could not load Drive: ${(error as Error).message}`,
      });
    }
  }, []);

  const connectGoogle = useCallback(
    (service: GoogleService) => {
      if (googleToken.current) {
        void runGoogleService(service);
        return;
      }
      if (!googleTokenClient.current) {
        googleTokenClient.current = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: GOOGLE_SCOPES,
          callback: () => {},
        });
      }
      googleTokenClient.current.callback = (response) => {
        if (response.error || !response.access_token) {
          setMail((prev) => ({
            ...prev,
            status: "error",
            error: `Google sign-in failed: ${response.error ?? "no token"}`,
          }));
          return;
        }
        googleToken.current = response.access_token;
        void runGoogleService(service);
      };
      googleTokenClient.current.requestAccessToken({ prompt: "consent" });
    },
    [runGoogleService],
  );

  /* ---------------- Slack ---------------- */

  const runSlack = useCallback(async () => {
    const token = slackToken.current;
    if (!token) return;
    setSlack({ status: "loading", meta: "loading…", items: [] });
    try {
      const items = await loadSlack(token);
      setSlack({
        status: "ready",
        meta: `${items.length} channels shown${slackTeam?.name ? ` · ${slackTeam.name}` : ""}`,
        items,
      });
      setStats((prev) => ({ ...prev, slack: String(countActiveToday(items)) }));
    } catch (error) {
      setSlack({
        status: "error",
        meta: "error",
        items: [],
        error: `Could not load Slack: ${(error as Error).message}`,
      });
    }
  }, [slackTeam]);

  // Once the redirect handed us a token, pull channel activity.
  const slackLoaded = useRef(false);
  if (mounted && slackToken.current && !slackLoaded.current) {
    slackLoaded.current = true;
    void runSlack();
  }

  /* ---------------- Microsoft ---------------- */

  const runMicrosoftService = useCallback(async (service: MicrosoftService) => {
    const token = msToken.current;
    if (!token) return;
    setMsConnected((prev) => new Set(prev).add(service));

    if (service === "outlook") {
      setOutlook({ status: "loading", meta: "loading…", items: [] });
      try {
        const items = await loadOutlook(token);
        setOutlook({
          status: "ready",
          meta: `${items.length} messages shown`,
          items,
        });
      } catch (error) {
        setOutlook({
          status: "error",
          meta: "error",
          items: [],
          error: `Could not load Outlook: ${(error as Error).message}`,
        });
      }
      return;
    }

    if (service === "calendar") {
      setMscal({ status: "loading", meta: "loading…", items: [] });
      try {
        const items = await loadMsCalendar(token);
        setMscal({ status: "ready", meta: `${items.length} upcoming`, items });
      } catch (error) {
        setMscal({
          status: "error",
          meta: "error",
          items: [],
          error: `Could not load calendar: ${(error as Error).message}`,
        });
      }
      return;
    }

    setOnedrive({ status: "loading", meta: "loading…", items: [] });
    try {
      const items = await loadOneDrive(token);
      setOnedrive({ status: "ready", meta: `${items.length} files shown`, items });
    } catch (error) {
      setOnedrive({
        status: "error",
        meta: "error",
        items: [],
        error: `Could not load OneDrive: ${(error as Error).message}`,
      });
    }
  }, []);

  const connectMicrosoft = useCallback(
    async (service: MicrosoftService) => {
      try {
        if (!msToken.current) {
          if (!msalInstance.current) {
            msalInstance.current = new msal.PublicClientApplication({
              auth: {
                clientId: MICROSOFT_CLIENT_ID,
                authority: MICROSOFT_AUTHORITY,
                redirectUri: window.location.origin + window.location.pathname,
              },
              cache: { cacheLocation: "sessionStorage" },
            });
            await msalInstance.current.initialize?.();
          }
          const instance = msalInstance.current;
          const result = await instance.loginPopup({ scopes: MICROSOFT_SCOPES });
          const account = result.account ?? instance.getAllAccounts()[0];
          instance.setActiveAccount(account);
          const tokenResponse = await instance
            .acquireTokenSilent({ scopes: MICROSOFT_SCOPES, account })
            .catch(() => instance.acquireTokenPopup({ scopes: MICROSOFT_SCOPES }));
          msToken.current = tokenResponse.accessToken;
          setMsAccountLabel(account.username ?? account.name ?? "");
        }
        await runMicrosoftService(service);
      } catch (error) {
        setOutlook((prev) => ({
          ...prev,
          status: "error",
          error: `Microsoft sign-in failed: ${(error as Error).message}`,
        }));
      }
    },
    [runMicrosoftService],
  );

  /* ---------------- Render ---------------- */

  const googleConfigured = Boolean(GOOGLE_CLIENT_ID);
  const slackConfigured = Boolean(SLACK_CLIENT_ID);
  const msConfigured = Boolean(MICROSOFT_CLIENT_ID);

  const toggleProvider = (name: string) =>
    setOpenProvider((current) => (current === name ? null : name));

  return (
    <div className="aide-dashboard">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setGoogleReady(true)}
      />
      <Script
        src="https://alcdn.msauth.net/browser/2.38.3/js/msal-browser.min.js"
        strategy="afterInteractive"
        onLoad={() => setMsalReady(true)}
      />

      <div className="hero">
        <div className="hero-left">
          <Image
            className="hero-mark"
            src="/aide-mark.png"
            alt=""
            width={240}
            height={230}
          />
          <div className="hero-text">
            <div className="hero-eyebrow">{heroDate}</div>
            <h1>{greetingFor(intakeName)}</h1>
            <div className="tagline">Know what matters, when it matters</div>
          </div>
        </div>
        <div className="hero-right">
          <div>
            <span className="refresh-dot" />
            Live · customer environment
          </div>
          <div className="hero-links">
            <SignOutLink />
            <Link className="home-link" href="/">
              &larr; Back to site
            </Link>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="section-label">At a glance</div>
        <div className="stats">
          {[
            { label: "Unread emails", value: stats.unread },
            { label: "Important / flagged", value: stats.important },
            { label: "Drive files (7d)", value: stats.files },
            { label: "Slack channels active", value: stats.slack },
          ].map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="label">{stat.label}</div>
              <div className="num">{stat.value}</div>
              <div className="bar">
                <i />
              </div>
            </div>
          ))}
        </div>

        <div className="section-label">Connections</div>
        <div className="connections">
          {/* GOOGLE */}
          <div className={`provider${openProvider === "google" ? " open" : ""}`}>
            <button
              className="provider-head"
              type="button"
              aria-expanded={openProvider === "google"}
              onClick={() => toggleProvider("google")}
            >
              <span className="provider-logo">
                <Icon.GoogleIcon />
              </span>
              <span className="provider-title">
                <span className="p-name">Google</span>
                <span
                  className={`p-sub${googleConnected.size > 0 ? " on" : ""}`}
                >
                  {googleConnected.size > 0 ? "Connected" : "Not connected"}
                </span>
              </span>
              <span className="provider-chevron">▾</span>
            </button>
            {openProvider === "google" && (
              <div className="provider-body">
                {(
                  [
                    { key: "gmail", label: "Gmail", icon: <Icon.GmailIcon /> },
                    {
                      key: "calendar",
                      label: "Calendar",
                      icon: <Icon.GoogleCalendarIcon />,
                    },
                    { key: "drive", label: "Google Drive", icon: <Icon.DriveIcon /> },
                  ] as const
                ).map((service) => (
                  <div className="service-row" key={service.key}>
                    <span className="svc-logo">{service.icon}</span>
                    <div className="svc-name">{service.label}</div>
                    <button
                      className={`conn-btn${googleConnected.has(service.key) ? " connected" : ""}`}
                      type="button"
                      disabled={!googleConfigured || !googleReady}
                      onClick={() => connectGoogle(service.key)}
                    >
                      {googleConnected.has(service.key) ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
                <div className="service-row soon">
                  <span className="svc-logo">
                    <Icon.MeetIcon />
                  </span>
                  <div className="svc-name">Google Meet</div>
                  <span className="soon-tag">Coming soon</span>
                </div>
                <div className="service-row soon">
                  <span className="svc-logo">
                    <Icon.YouTubeIcon />
                  </span>
                  <div className="svc-name">YouTube statistics</div>
                  <span className="soon-tag">Coming soon</span>
                </div>
                <div className="service-row soon">
                  <span className="svc-logo">
                    <Icon.HomeIcon />
                  </span>
                  <div className="svc-name">Google Home</div>
                  <span className="soon-tag">Coming soon</span>
                </div>
                {!googleConfigured && (
                  <div className="config-warning">
                    Google isn&rsquo;t configured — set
                    NEXT_PUBLIC_GOOGLE_CLIENT_ID.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SLACK */}
          <div className={`provider${openProvider === "slack" ? " open" : ""}`}>
            <button
              className="provider-head"
              type="button"
              aria-expanded={openProvider === "slack"}
              onClick={() => toggleProvider("slack")}
            >
              <span className="provider-logo">
                <Icon.SlackIcon />
              </span>
              <span className="provider-title">
                <span className="p-name">Slack</span>
                <span className={`p-sub${slackTeam ? " on" : ""}`}>
                  {slackTeam
                    ? `Connected${slackTeam.name ? ` · ${slackTeam.name}` : ""}`
                    : "Not connected"}
                </span>
              </span>
              <span className="provider-chevron">▾</span>
            </button>
            {openProvider === "slack" && (
              <div className="provider-body">
                <div className="service-row">
                  <span className="svc-logo">
                    <Icon.SlackHashIcon />
                  </span>
                  <div className="svc-name">Channels &amp; messages</div>
                  <button
                    className={`conn-btn${slackTeam ? " connected" : ""}`}
                    type="button"
                    disabled={!slackConfigured}
                    onClick={() => startSlackAuth(SLACK_CLIENT_ID)}
                  >
                    {slackTeam ? "Connected" : "Connect"}
                  </button>
                </div>
                {slackError && (
                  <div className="config-warning">
                    Slack connection failed: {slackError}
                  </div>
                )}
                {!slackConfigured && (
                  <div className="config-warning">
                    Slack isn&rsquo;t configured — set NEXT_PUBLIC_SLACK_CLIENT_ID
                    in the browser build, and SLACK_CLIENT_ID / SLACK_CLIENT_SECRET
                    as server environment variables.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MICROSOFT */}
          <div className={`provider${openProvider === "microsoft" ? " open" : ""}`}>
            <button
              className="provider-head"
              type="button"
              aria-expanded={openProvider === "microsoft"}
              onClick={() => toggleProvider("microsoft")}
            >
              <span className="provider-logo">
                <Icon.MicrosoftIcon />
              </span>
              <span className="provider-title">
                <span className="p-name">Microsoft</span>
                <span className={`p-sub${msConnected.size > 0 ? " on" : ""}`}>
                  {msConnected.size > 0
                    ? `Connected${msAccountLabel ? ` · ${msAccountLabel}` : ""}`
                    : "Not connected"}
                </span>
              </span>
              <span className="provider-chevron">▾</span>
            </button>
            {openProvider === "microsoft" && (
              <div className="provider-body">
                {(
                  [
                    {
                      key: "outlook",
                      label: "Outlook mail",
                      icon: <Icon.OutlookIcon />,
                    },
                    {
                      key: "calendar",
                      label: "Outlook calendar",
                      icon: <Icon.OutlookCalendarIcon />,
                    },
                    {
                      key: "onedrive",
                      label: "OneDrive",
                      icon: <Icon.OneDriveIcon />,
                    },
                  ] as const
                ).map((service) => (
                  <div className="service-row" key={service.key}>
                    <span className="svc-logo">{service.icon}</span>
                    <div className="svc-name">{service.label}</div>
                    <button
                      className={`conn-btn${msConnected.has(service.key) ? " connected" : ""}`}
                      type="button"
                      disabled={!msConfigured || !msalReady}
                      onClick={() => void connectMicrosoft(service.key)}
                    >
                      {msConnected.has(service.key) ? "Connected" : "Connect"}
                    </button>
                  </div>
                ))}
                <div className="service-row soon">
                  <span className="svc-logo">
                    <Icon.TeamsIcon />
                  </span>
                  <div className="svc-name">Teams</div>
                  <span className="soon-tag">Coming soon</span>
                </div>
                {!msConfigured && (
                  <div className="config-warning">
                    Microsoft isn&rsquo;t configured — register a
                    single-page application in Azure (Entra ID &gt; App
                    registrations), add this site&rsquo;s URL as a redirect URI,
                    then set NEXT_PUBLIC_MICROSOFT_CLIENT_ID. Work and university
                    accounts may need IT admin consent.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="section-label">Activity</div>

        <Panel
          title="Recent inbox activity"
          state={mail}
          lockedHint="Connect Google above to see Gmail activity."
          loadingLabel="Gmail"
          emptyLabel="No inbox threads found."
        >
          {(items) => <MailRows items={items} />}
        </Panel>

        <Panel
          title="Upcoming Google calendar"
          state={gcal}
          lockedHint="Connect Google Calendar above to see events."
          loadingLabel="Calendar"
          emptyLabel="No upcoming events found."
        >
          {(items) => <EventRows items={items} />}
        </Panel>

        <Panel
          title="Recent Drive activity"
          state={drive}
          lockedHint="Connect Google above to see Drive activity."
          loadingLabel="Drive"
          emptyLabel="No recent Drive files found."
        >
          {(items) => <FileRows items={items} />}
        </Panel>

        <Panel
          title="Recent Slack activity"
          state={slack}
          lockedHint="Connect Slack above to see channel activity."
          loadingLabel="Slack"
          emptyLabel="No recent channel activity found."
        >
          {(items) => <SlackRows items={items} teamId={slackTeam?.id ?? ""} />}
        </Panel>

        <Panel
          title="Recent Outlook mail"
          state={outlook}
          lockedHint="Connect Microsoft above to see Outlook mail."
          loadingLabel="Outlook"
          emptyLabel="No Outlook messages found."
        >
          {(items) => <MailRows items={items} />}
        </Panel>

        <Panel
          title="Upcoming Outlook calendar"
          state={mscal}
          lockedHint="Connect Microsoft above to see calendar events."
          loadingLabel="calendar"
          emptyLabel="No upcoming events found."
        >
          {(items) => <EventRows items={items} />}
        </Panel>

        <Panel
          title="Recent OneDrive activity"
          state={onedrive}
          lockedHint="Connect Microsoft above to see OneDrive activity."
          loadingLabel="OneDrive"
          emptyLabel="No recent OneDrive files found."
        >
          {(items) => <FileRows items={items} />}
        </Panel>

        <div className="footer-note">
          Live client-side view — nothing from Gmail, Drive, or Slack is ever
          stored. Reload the page and you&rsquo;ll need to reconnect.
        </div>
      </div>
    </div>
  );
}
