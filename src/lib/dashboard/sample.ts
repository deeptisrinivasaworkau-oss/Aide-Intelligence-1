import { heuristicVerdict, contentSummary } from "./format";
import type { EventItem, FileItem, MailItem, SlackItem } from "./types";

/**
 * Illustrative data so the dashboard demonstrates the executive brief before
 * any source is connected. It is always shown behind a visible "sample data"
 * banner — it must never be mistaken for the viewer's own activity.
 */

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const hoursAhead = (h: number) =>
  new Date(Date.now() + h * 60 * 60 * 1000).toISOString();

const rawMail = [
  {
    id: "s1",
    sender: "Katarzyna Nowak <k.nowak@northbridge.pl>",
    subject: "Re: Warsaw fit-out — revised completion date",
    snippet:
      "The contractor has moved handover to the 14th, which puts us past the lease commencement. Can you confirm whether we hold them to the penalty clause?",
    date: hoursAgo(1),
    unread: true,
    important: true,
  },
  {
    id: "s2",
    sender: "accounts@meridian-facilities.com",
    subject: "Invoice INV-20418 — now 21 days overdue",
    snippet:
      "This invoice for GBP 18,400 remains unpaid and is now past the agreed terms. Please advise on a payment date.",
    date: hoursAgo(4),
    unread: true,
    important: false,
  },
  {
    id: "s3",
    sender: "Tomasz Lis <t.lis@northbridge.pl>",
    subject: "Site 3 staffing — two resignations this week",
    snippet:
      "Both shift supervisors at Kraków have resigned. We are covering with agency staff but that breaks the cost model from month three.",
    date: hoursAgo(9),
    unread: true,
    important: true,
  },
  {
    id: "s4",
    sender: "Zurich Chamber of Commerce <events@zhk.ch>",
    subject: "Invitation: mid-market operations forum",
    snippet:
      "You are invited to the autumn forum on operational resilience. Unsubscribe at any time.",
    date: hoursAgo(22),
    unread: false,
    important: false,
  },
];

export const SAMPLE_MAIL: MailItem[] = rawMail.map((m) => ({
  ...m,
  link: "#",
  summaryLine: contentSummary(m),
  verdict: heuristicVerdict(m),
}));

export const SAMPLE_EVENTS: EventItem[] = [
  {
    id: "e1",
    title: "Weekly operating review — all sites",
    start: hoursAhead(2),
    location: "Teams",
    link: "#",
  },
  {
    id: "e2",
    title: "Lease commencement call — Warsaw",
    start: hoursAhead(26),
    location: "Warsaw office",
    link: "#",
  },
  {
    id: "e3",
    title: "Board pack review",
    start: hoursAhead(52),
    location: "Zurich",
    link: "#",
  },
];

export const SAMPLE_FILES: FileItem[] = [
  {
    id: "f1",
    name: "Q3 operating pack — draft 4.xlsx",
    modified: hoursAgo(3),
    owner: "finance@northbridge.pl",
    link: "#",
    type: "XLSX",
  },
  {
    id: "f2",
    name: "Kraków staffing model.xlsx",
    modified: hoursAgo(7),
    owner: "t.lis@northbridge.pl",
    link: "#",
    type: "XLSX",
  },
  {
    id: "f3",
    name: "Meridian contract — signed.pdf",
    modified: hoursAgo(30),
    owner: "legal@northbridge.pl",
    link: "#",
    type: "PDF",
  },
];

export const SAMPLE_SLACK: SlackItem[] = [
  {
    channelId: "c1",
    channelName: "ops-warsaw",
    text: "Handover slipped again — contractor now saying the 14th.",
    ts: String(Math.floor(Date.now() / 1000) - 2400),
  },
  {
    channelId: "c2",
    channelName: "finance",
    text: "Meridian still hasn't paid INV-20418. Chasing again today.",
    ts: String(Math.floor(Date.now() / 1000) - 9000),
  },
  {
    channelId: "c3",
    channelName: "leadership",
    text: "Adding Kraków staffing to Thursday's agenda.",
    ts: String(Math.floor(Date.now() / 1000) - 24000),
  },
];

export const SAMPLE_STATS = {
  unread: String(SAMPLE_MAIL.filter((m) => m.unread).length),
  important: String(SAMPLE_MAIL.filter((m) => m.important).length),
  files: String(SAMPLE_FILES.length),
  slack: String(SAMPLE_SLACK.length),
};
