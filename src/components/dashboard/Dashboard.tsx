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
import {
  SAMPLE_EVENTS,
  SAMPLE_FILES,
  SAMPLE_MAIL,
  SAMPLE_SLACK,
  SAMPLE_STATS,
} from "@/lib/dashboard/sample";
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
import ViewTabs, { type View } from "./DashboardTabs";
import Brief from "./Brief";
import { buildBrief } from "@/lib/dashboard/brief";
import SourceRow from "./SourceRow";
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

  const [view, setView] = useState<View>("summary");
  const [query, setQuery] = useState("");
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

  const sample = <T,>(items: T[], meta: string): PanelState<T> => ({
    status: "ready",
    meta,
    items,
  });

  const [mail, setMail] = useState<PanelState<MailItem>>(() =>
    sample(SAMPLE_MAIL, `${SAMPLE_MAIL.length} threads · sample`),
  );
  const [gcal, setGcal] = useState<PanelState<EventItem>>(() =>
    sample(SAMPLE_EVENTS, `${SAMPLE_EVENTS.length} upcoming · sample`),
  );
  const [drive, setDrive] = useState<PanelState<FileItem>>(() =>
    sample(SAMPLE_FILES, `${SAMPLE_FILES.length} files · sample`),
  );
  const [slack, setSlack] = useState<PanelState<SlackItem>>(() =>
    sample(SAMPLE_SLACK, `${SAMPLE_SLACK.length} channels · sample`),
  );
  const [outlook, setOutlook] = useState<PanelState<MailItem>>(initialPanel);
  const [mscal, setMscal] = useState<PanelState<EventItem>>(initialPanel);
  const [onedrive, setOnedrive] = useState<PanelState<FileItem>>(initialPanel);

  const [stats, setStats] = useState(SAMPLE_STATS);

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

  const anyConnected =
    googleConnected.size > 0 || msConnected.size > 0 || slackTeam !== null;

  const connected = {
    google: googleConnected.size > 0,
    microsoft: msConnected.size > 0,
    slack: slackTeam !== null,
  };

  // The briefing the pitch promises: signals from every connected source
  // classified into deadlines, risks, decisions, unusual activity and actions,
  // each traceable back to the system it came from.
  const brief = buildBrief({
    mail: mail.items,
    outlookMail: outlook.items,
    events: gcal.items,
    msEvents: mscal.items,
    files: drive.items,
    slack: slack.items,
  });

  // Just the two that drive a decision. File and channel counts are activity
  // volume, not signal, and they competed with the briefing for attention.
  const STAT_CARDS = [
    { label: "Unread emails", value: stats.unread },
    { label: "Important / flagged", value: stats.important },
  ];

  // One search box, shared across every view, filters whatever's on screen
  // rather than opening a separate results page.
  const q = query.trim().toLowerCase();
  const searchable = (parts: (string | null | undefined)[]) =>
    parts.filter(Boolean).join(" ").toLowerCase();
  const filterItems = <T,>(items: T[], text: (item: T) => string): T[] =>
    q ? items.filter((item) => text(item).includes(q)) : items;
  const noMatchLabel = "No matches for your search.";

  const filteredBrief = filterItems(brief, (i) =>
    searchable([i.headline, i.detail, i.recommendation, i.source]),
  );
  const filteredMail = filterItems(mail.items, (m) =>
    searchable([m.sender, m.subject, m.snippet, m.summaryLine]),
  );
  const filteredGcal = filterItems(gcal.items, (e) => searchable([e.title, e.location]));
  const filteredDrive = filterItems(drive.items, (f) => searchable([f.name, f.owner]));
  const filteredOutlook = filterItems(outlook.items, (m) =>
    searchable([m.sender, m.subject, m.snippet, m.summaryLine]),
  );
  const filteredMscal = filterItems(mscal.items, (e) => searchable([e.title, e.location]));
  const filteredOnedrive = filterItems(onedrive.items, (f) => searchable([f.name, f.owner]));
  const filteredSlack = filterItems(slack.items, (s) => searchable([s.channelName, s.text]));

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
        {!anyConnected && (
          <p className="sample-banner" role="note">
            <strong>Sample data.</strong> This is an illustrative brief so you can
            see how Aide presents priorities. Connect a source to replace it with
            your own.
          </p>
        )}

        <div className="section-label-row">
          <div className="section-label">At a glance</div>
          <label className="search-box">
            <svg aria-hidden="true" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <line x1="14" y1="14" x2="18.5" y2="18.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mail, files, channels…"
              aria-label="Search dashboard"
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
          </label>
        </div>
        <div className="stats">
          {STAT_CARDS.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="label">{stat.label}</div>
              <div className="num">{stat.value}</div>
              <div className="bar">
                <i />
              </div>
            </div>
          ))}
        </div>

        <ViewTabs view={view} onChange={setView} connected={connected} />

        {/* ---------------- Summary ---------------- */}
        {view === "summary" && (
          <div className="view-body">
            <div className="brief-head">
              <div className="section-label">Your briefing</div>
              <p className="brief-sub">
                {q
                  ? `${filteredBrief.length} match${filteredBrief.length === 1 ? "" : "es"} for "${query.trim()}".`
                  : `${brief.length} item${brief.length === 1 ? "" : "s"} across your connected systems, ranked by what needs deciding.`}
              </p>
            </div>
            <Brief
              items={filteredBrief}
              emptyMessage={q ? noMatchLabel : undefined}
            />

          </div>
        )}

        {/* ---------------- Google ---------------- */}
        {view === "google" && (
          <div className="view-body">
            <div className="source-list">
              <SourceRow
                icon={<Icon.GmailIcon />}
                name="Gmail"
                note="Inbox threads and triage"
                connected={googleConnected.has("gmail")}
                disabled={!googleConfigured || !googleReady}
                onConnect={() => connectGoogle("gmail")}
              />
              <SourceRow
                icon={<Icon.GoogleCalendarIcon />}
                name="Calendar"
                note="Upcoming commitments"
                connected={googleConnected.has("calendar")}
                disabled={!googleConfigured || !googleReady}
                onConnect={() => connectGoogle("calendar")}
              />
              <SourceRow
                icon={<Icon.DriveIcon />}
                name="Drive"
                note="Recently changed documents"
                connected={googleConnected.has("drive")}
                disabled={!googleConfigured || !googleReady}
                onConnect={() => connectGoogle("drive")}
              />
              <SourceRow icon={<Icon.MeetIcon />} name="Meet" soon />
              <SourceRow icon={<Icon.YouTubeIcon />} name="YouTube statistics" soon />
              <SourceRow icon={<Icon.HomeIcon />} name="Google Home" soon />
            </div>

            {!googleConfigured && (
              <p className="source-warning">
                Google isn&rsquo;t configured — set NEXT_PUBLIC_GOOGLE_CLIENT_ID.
              </p>
            )}

            <Panel
              title="Recent inbox activity"
              state={{ ...mail, items: filteredMail }}
              lockedHint="Connect Gmail above to see inbox activity."
              loadingLabel="Gmail"
              emptyLabel={q ? noMatchLabel : "No inbox threads found."}
            >
              {(items) => <MailRows items={items} />}
            </Panel>
            <Panel
              title="Upcoming calendar"
              state={{ ...gcal, items: filteredGcal }}
              lockedHint="Connect Calendar above to see events."
              loadingLabel="Calendar"
              emptyLabel={q ? noMatchLabel : "No upcoming events found."}
            >
              {(items) => <EventRows items={items} />}
            </Panel>
            <Panel
              title="Recent Drive activity"
              state={{ ...drive, items: filteredDrive }}
              lockedHint="Connect Drive above to see document activity."
              loadingLabel="Drive"
              emptyLabel={q ? noMatchLabel : "No recent Drive files found."}
            >
              {(items) => <FileRows items={items} />}
            </Panel>
          </div>
        )}

        {/* ---------------- Microsoft ---------------- */}
        {view === "microsoft" && (
          <div className="view-body">
            <div className="source-list">
              <SourceRow
                icon={<Icon.OutlookIcon />}
                name="Outlook mail"
                note="Inbox threads and triage"
                connected={msConnected.has("outlook")}
                disabled={!msConfigured || !msalReady}
                onConnect={() => void connectMicrosoft("outlook")}
              />
              <SourceRow
                icon={<Icon.OutlookCalendarIcon />}
                name="Outlook calendar"
                note="Upcoming commitments"
                connected={msConnected.has("calendar")}
                disabled={!msConfigured || !msalReady}
                onConnect={() => void connectMicrosoft("calendar")}
              />
              <SourceRow
                icon={<Icon.OneDriveIcon />}
                name="OneDrive"
                note="Recently changed documents"
                connected={msConnected.has("onedrive")}
                disabled={!msConfigured || !msalReady}
                onConnect={() => void connectMicrosoft("onedrive")}
              />
              <SourceRow icon={<Icon.TeamsIcon />} name="Teams" soon />
            </div>

            {!msConfigured && (
              <p className="source-warning">
                Microsoft isn&rsquo;t configured — register a single-page
                application in Azure (Entra ID &gt; App registrations), add this
                site&rsquo;s URL as a redirect URI, then set
                NEXT_PUBLIC_MICROSOFT_CLIENT_ID. Work and university accounts may
                need IT admin consent.
              </p>
            )}
            {msAccountLabel && (
              <p className="source-note-line">Signed in as {msAccountLabel}</p>
            )}

            <Panel
              title="Recent Outlook mail"
              state={{ ...outlook, items: filteredOutlook }}
              lockedHint="Connect Outlook above to see mail."
              loadingLabel="Outlook"
              emptyLabel={q ? noMatchLabel : "No Outlook messages found."}
            >
              {(items) => <MailRows items={items} />}
            </Panel>
            <Panel
              title="Upcoming Outlook calendar"
              state={{ ...mscal, items: filteredMscal }}
              lockedHint="Connect Outlook calendar above to see events."
              loadingLabel="calendar"
              emptyLabel={q ? noMatchLabel : "No upcoming events found."}
            >
              {(items) => <EventRows items={items} />}
            </Panel>
            <Panel
              title="Recent OneDrive activity"
              state={{ ...onedrive, items: filteredOnedrive }}
              lockedHint="Connect OneDrive above to see document activity."
              loadingLabel="OneDrive"
              emptyLabel={q ? noMatchLabel : "No recent OneDrive files found."}
            >
              {(items) => <FileRows items={items} />}
            </Panel>
          </div>
        )}

        {/* ---------------- Slack ---------------- */}
        {view === "slack" && (
          <div className="view-body">
            <div className="source-list">
              <SourceRow
                icon={<Icon.SlackHashIcon />}
                name="Channels & messages"
                note={slackTeam?.name ? `Workspace: ${slackTeam.name}` : "Public and private channels"}
                connected={slackTeam !== null}
                disabled={!slackConfigured}
                onConnect={() => startSlackAuth(SLACK_CLIENT_ID)}
              />
            </div>

            {slackError && (
              <p className="source-warning">Slack connection failed: {slackError}</p>
            )}
            {!slackConfigured && (
              <p className="source-warning">
                Slack isn&rsquo;t configured — set NEXT_PUBLIC_SLACK_CLIENT_ID in
                the browser build, and SLACK_CLIENT_ID / SLACK_CLIENT_SECRET as
                server environment variables.
              </p>
            )}

            <Panel
              title="Recent channel activity"
              state={{ ...slack, items: filteredSlack }}
              lockedHint="Connect Slack above to see channel activity."
              loadingLabel="Slack"
              emptyLabel={q ? noMatchLabel : "No recent channel activity found."}
            >
              {(items) => <SlackRows items={items} teamId={slackTeam?.id ?? ""} />}
            </Panel>
          </div>
        )}

        <div className="footer-note">
          Live client-side view — nothing from Gmail, Drive, Outlook or Slack is
          ever stored. Reload the page and you&rsquo;ll need to reconnect.
        </div>
      </div>
    </div>
  );
}
