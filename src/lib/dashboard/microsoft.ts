import { contentSummary, heuristicVerdict } from "./format";
import type { EventItem, FileItem, MailItem } from "./types";

export const MICROSOFT_AUTHORITY = "https://login.microsoftonline.com/common";
export const MICROSOFT_SCOPES = [
  "User.Read",
  "Mail.Read",
  "Calendars.Read",
  "Files.Read",
];

async function graphFetch(path: string, token: string) {
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(
      `${res.status} ${res.statusText}: ${(await res.text()).slice(0, 200)}`,
    );
  }
  return res.json();
}

export async function loadOutlook(token: string): Promise<MailItem[]> {
  const data = await graphFetch(
    "/me/messages?$top=15&$select=subject,from,receivedDateTime,bodyPreview,isRead,importance,webLink&$orderby=receivedDateTime desc",
    token,
  );

  return (data.value ?? []).map(
    (message: {
      id: string;
      subject?: string;
      bodyPreview?: string;
      receivedDateTime?: string;
      isRead?: boolean;
      importance?: string;
      webLink?: string;
      from?: { emailAddress?: { name?: string; address?: string } };
    }) => {
      const item = {
        id: message.id,
        sender:
          message.from?.emailAddress?.name ??
          message.from?.emailAddress?.address ??
          "unknown",
        subject: message.subject ?? "(no subject)",
        snippet: message.bodyPreview ?? "",
        date: message.receivedDateTime ?? null,
        unread: message.isRead === false,
        important: message.importance === "high",
        link: message.webLink ?? "#",
      };
      return {
        ...item,
        summaryLine: contentSummary(item),
        verdict: heuristicVerdict(item),
      };
    },
  );
}

export async function loadMsCalendar(token: string): Promise<EventItem[]> {
  const data = await graphFetch(
    `/me/events?$top=10&$select=subject,start,end,location,organizer,webLink&$orderby=start/dateTime&$filter=start/dateTime ge '${new Date().toISOString()}'`,
    token,
  );

  return (data.value ?? []).map(
    (event: {
      id: string;
      subject?: string;
      webLink?: string;
      start?: { dateTime?: string };
      location?: { displayName?: string };
    }) => ({
      id: event.id,
      title: event.subject ?? "(no title)",
      start: event.start?.dateTime ?? null,
      location: event.location?.displayName ?? "",
      link: event.webLink ?? "#",
    }),
  );
}

export async function loadOneDrive(token: string): Promise<FileItem[]> {
  const data = await graphFetch("/me/drive/recent?$top=10", token);

  return (data.value ?? []).map(
    (file: {
      id: string;
      name?: string;
      webUrl?: string;
      lastModifiedDateTime?: string;
      fileSystemInfo?: { lastModifiedDateTime?: string };
      lastModifiedBy?: { user?: { displayName?: string } };
    }) => ({
      id: file.id,
      name: file.name ?? "Untitled",
      modified:
        file.lastModifiedDateTime ??
        file.fileSystemInfo?.lastModifiedDateTime ??
        null,
      owner: file.lastModifiedBy?.user?.displayName ?? "",
      link: file.webUrl ?? "#",
      type: file.name?.includes(".")
        ? (file.name.split(".").pop() as string).toUpperCase()
        : "FILE",
    }),
  );
}
