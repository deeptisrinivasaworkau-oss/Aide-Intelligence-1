import {
  b64urlDecode,
  contentSummary,
  decodeEntities,
  heuristicVerdict,
} from "./format";
import type { EventItem, FileItem, MailItem } from "./types";

export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
].join(" ");

async function googleFetch(url: string, token: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    throw new Error(
      `${res.status} ${res.statusText}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  return res.json();
}

type GmailHeader = { name: string; value: string };

function headerValue(headers: GmailHeader[] | undefined, name: string): string {
  return headers?.find((h) => h.name === name)?.value ?? "";
}

/** Walk a Gmail payload tree and pull out readable text, preferring text/plain. */
type GmailPayload = {
  mimeType?: string;
  body?: { data?: string };
  parts?: GmailPayload[];
};

export function extractGmailBody(payload: GmailPayload | undefined): string {
  if (!payload) return "";
  let plain = "";
  let html = "";

  const walk = (part: GmailPayload | undefined) => {
    if (!part) return;
    const mime = part.mimeType ?? "";
    if (mime === "text/plain" && part.body?.data) {
      plain += `${b64urlDecode(part.body.data)}\n`;
    } else if (mime === "text/html" && part.body?.data) {
      html += `${b64urlDecode(part.body.data)}\n`;
    }
    part.parts?.forEach(walk);
  };
  walk(payload);

  let text = plain.trim();
  if (!text && html) {
    // Crude HTML-to-text: strip tags, decode entities, collapse whitespace.
    text = decodeEntities(
      html
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " "),
    );
  }
  return text.replace(/\s+/g, " ").trim().slice(0, 4000);
}

export async function loadMail(token: string): Promise<MailItem[]> {
  const list = await googleFetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/threads?${new URLSearchParams({
      maxResults: "15",
      q: "in:inbox",
    })}`,
    token,
  );

  const threads = (list.threads ?? []) as { id: string }[];
  const detailed = await Promise.all(
    threads.map((thread) =>
      googleFetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${thread.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
        token,
      ).catch(() => null),
    ),
  );

  return detailed
    .filter(Boolean)
    .map((thread) => {
      const messages = thread.messages ?? [];
      const latest = messages[messages.length - 1] ?? {};
      const labelIds: string[] = latest.labelIds ?? [];
      const headers: GmailHeader[] = latest.payload?.headers ?? [];

      const item = {
        id: thread.id,
        sender: headerValue(headers, "From") || "unknown",
        subject: headerValue(headers, "Subject") || "(no subject)",
        snippet: latest.snippet ?? "",
        date: latest.internalDate
          ? new Date(Number(latest.internalDate)).toISOString()
          : null,
        unread: labelIds.includes("UNREAD"),
        important: labelIds.includes("IMPORTANT"),
        link: `https://mail.google.com/mail/u/0/#all/${thread.id}`,
      };

      return {
        ...item,
        summaryLine: contentSummary(item),
        verdict: heuristicVerdict(item),
      };
    })
    .sort(
      (a, b) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
    );
}

/** Fetch each thread's full latest message so the AI route can read real bodies. */
export async function fetchMailBodies(items: MailItem[], token: string) {
  return Promise.all(
    items.map(async (item) => {
      try {
        const full = await googleFetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/threads/${item.id}?format=full`,
          token,
        );
        const messages = full.messages ?? [];
        const latest = messages[messages.length - 1] ?? {};
        return {
          sender: item.sender,
          subject: item.subject,
          body: extractGmailBody(latest.payload),
        };
      } catch {
        return { sender: item.sender, subject: item.subject, body: item.snippet };
      }
    }),
  );
}

function driveTypeTag(mime?: string, ext?: string): string {
  if (ext) return ext.toUpperCase();
  if (!mime) return "FILE";
  if (mime.includes("folder")) return "FOLDER";
  if (mime.includes("spreadsheet")) return "SHEET";
  if (mime.includes("document")) return "DOC";
  if (mime.includes("presentation")) return "SLIDES";
  return "FILE";
}

export async function loadDrive(token: string): Promise<FileItem[]> {
  const data = await googleFetch(
    `https://www.googleapis.com/drive/v3/files?${new URLSearchParams({
      pageSize: "10",
      orderBy: "modifiedTime desc",
      fields: "files(id,name,mimeType,modifiedTime,fileExtension,owners,webViewLink)",
    })}`,
    token,
  );

  return (data.files ?? []).map(
    (file: {
      id: string;
      name?: string;
      mimeType?: string;
      modifiedTime?: string;
      fileExtension?: string;
      owners?: { emailAddress?: string }[];
      webViewLink?: string;
    }) => ({
      id: file.id,
      name: file.name ?? "Untitled",
      modified: file.modifiedTime ?? null,
      owner: file.owners?.[0]?.emailAddress ?? "",
      link: file.webViewLink ?? "#",
      type: driveTypeTag(file.mimeType, file.fileExtension),
    }),
  );
}

export async function loadGoogleCalendar(token: string): Promise<EventItem[]> {
  const data = await googleFetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${new URLSearchParams(
      {
        maxResults: "10",
        orderBy: "startTime",
        singleEvents: "true",
        timeMin: new Date().toISOString(),
      },
    )}`,
    token,
  );

  return (data.items ?? []).map(
    (event: {
      id: string;
      summary?: string;
      location?: string;
      htmlLink?: string;
      start?: { dateTime?: string; date?: string };
    }) => ({
      id: event.id,
      title: event.summary ?? "(no title)",
      start: event.start?.dateTime ?? event.start?.date ?? null,
      location: event.location ?? "",
      link: event.htmlLink ?? "#",
    }),
  );
}

/** Files modified in the last 7 days — drives the "Drive files (7d)" stat. */
export function countRecentFiles(files: FileItem[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return files.filter(
    (file) => file.modified && new Date(file.modified).getTime() > cutoff,
  ).length;
}
