export type MailItem = {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  date: string | null;
  unread: boolean;
  important: boolean;
  link: string;
  summaryLine: string;
  verdict: string;
};

export type FileItem = {
  id: string;
  name: string;
  modified: string | null;
  owner: string;
  link: string;
  type: string;
};

export type EventItem = {
  id: string;
  title: string;
  start: string | null;
  location: string;
  link: string;
};

export type SlackItem = {
  channelId: string;
  channelName: string;
  text: string;
  ts: string;
};

/** Loading/loaded/failed state for one activity panel. */
export type PanelState<T> = {
  status: "locked" | "loading" | "ready" | "error";
  meta: string;
  items: T[];
  error?: string;
};

export function initialPanel<T>(): PanelState<T> {
  return { status: "locked", meta: "not connected", items: [] };
}
