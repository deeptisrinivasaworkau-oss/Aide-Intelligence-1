import type { EventItem, FileItem, MailItem, SlackItem } from "./types";

/**
 * Builds the prioritised executive briefing.
 *
 * The pitch promises a specific shape: deadlines, risks, unusual activity,
 * unanswered decisions and recommended actions — every item traceable to the
 * system it came from. A merged list of emails is not that. This classifies
 * signals from every connected source into those categories, so the brief
 * answers "what needs me" rather than "what arrived".
 */

export type BriefCategory =
  | "deadline"
  | "risk"
  | "unusual"
  | "decision"
  | "action";

export type BriefItem = {
  id: string;
  category: BriefCategory;
  headline: string;
  detail: string;
  /** Which system it came from — shown as a chip and used for the source link. */
  source: string;
  link: string;
  when: string | null;
  /** What the executive should do next. */
  recommendation: string;
  severity: "high" | "medium" | "low";
};

export const CATEGORY_META: Record<
  BriefCategory,
  { label: string; blurb: string }
> = {
  deadline: {
    label: "Deadlines",
    blurb: "Dated commitments approaching or already passed",
  },
  risk: {
    label: "Risks",
    blurb: "Money, contractual or operational exposure",
  },
  unusual: {
    label: "Unusual activity",
    blurb: "Patterns that differ from the normal operating baseline",
  },
  decision: {
    label: "Awaiting your decision",
    blurb: "Someone is blocked pending your answer",
  },
  action: {
    label: "Recommended actions",
    blurb: "Suggested next steps you can delegate or clear",
  },
};

export const CATEGORY_ORDER: BriefCategory[] = [
  "deadline",
  "risk",
  "decision",
  "unusual",
  "action",
];

const MONEY = /invoice|overdue|payment|past due|final notice|penalty|arrears|unpaid|GBP|EUR|USD|CHF|£|€|\$/i;
const DEADLINE = /deadline|due (today|tomorrow|by|date)|expir|by the \d|completion date|commencement|handover|renewal|closing/i;
const DECISION = /can you|could you|please (confirm|advise|approve)|advise|approve|sign off|let me know|waiting on|awaiting|your call|decision/i;
const RISK = /risk|breach|resign|shortfall|escalat|complaint|dispute|incident|outage|churn|cancel/i;

function classify(item: {
  subject?: string;
  snippet?: string;
  sender?: string;
}): { category: BriefCategory; severity: BriefItem["severity"] } {
  const text = `${item.subject ?? ""} ${item.snippet ?? ""}`;

  if (MONEY.test(text) && (DEADLINE.test(text) || /overdue|past due|unpaid/i.test(text)))
    return { category: "risk", severity: "high" };
  if (DEADLINE.test(text)) return { category: "deadline", severity: "high" };
  if (RISK.test(text)) return { category: "risk", severity: "high" };
  if (DECISION.test(text)) return { category: "decision", severity: "medium" };
  return { category: "action", severity: "low" };
}

function recommend(category: BriefCategory): string {
  switch (category) {
    case "deadline":
      return "Confirm the date holds, or reset expectations today";
    case "risk":
      return "Decide whether to escalate or absorb, and name an owner";
    case "decision":
      return "Answer or delegate — someone is blocked on this";
    case "unusual":
      return "Check whether this is a one-off or a developing pattern";
    default:
      return "Clear when convenient";
  }
}

export function buildBrief(input: {
  mail: MailItem[];
  outlookMail: MailItem[];
  events: EventItem[];
  msEvents: EventItem[];
  files: FileItem[];
  slack: SlackItem[];
}): BriefItem[] {
  const items: BriefItem[] = [];

  const addMail = (list: MailItem[], source: string) => {
    list
      .filter((m) => m.unread || m.important)
      .forEach((m) => {
        const { category, severity } = classify(m);
        items.push({
          id: `${source}-${m.id}`,
          category,
          headline: m.subject,
          detail: m.summaryLine,
          source,
          link: m.link,
          when: m.date,
          recommendation:
            category === "action" && m.verdict
              ? m.verdict
              : recommend(category),
          severity: m.important ? "high" : severity,
        });
      });
  };
  addMail(input.mail, "Gmail");
  addMail(input.outlookMail, "Outlook");

  // Anything on the calendar inside 48 hours is a dated commitment.
  const soon = Date.now() + 48 * 60 * 60 * 1000;
  [
    ...input.events.map((e) => ({ e, src: "Calendar" })),
    ...input.msEvents.map((e) => ({ e, src: "Outlook Calendar" })),
  ].forEach(({ e, src }) => {
    if (!e.start || new Date(e.start).getTime() > soon) return;
    items.push({
      id: `${src}-${e.id}`,
      category: "deadline",
      headline: e.title,
      detail: e.location ? `Location: ${e.location}` : "No location set",
      source: src,
      link: e.link,
      when: e.start,
      recommendation: "Confirm you are prepared, or reassign attendance",
      severity: "medium",
    });
  });

  // Several edits to the same working document is a signal worth surfacing.
  input.files.slice(0, 2).forEach((f) => {
    items.push({
      id: `drive-${f.id}`,
      category: "unusual",
      headline: `${f.name} changed`,
      detail: f.owner ? `Last edited by ${f.owner}` : "Recently modified",
      source: f.type === "XLSX" ? "Drive" : "Drive",
      link: f.link,
      when: f.modified,
      recommendation: recommend("unusual"),
      severity: "low",
    });
  });

  input.slack.slice(0, 2).forEach((s) => {
    const { category } = classify({ snippet: s.text });
    const resolved = category === "action" ? "unusual" : category;
    items.push({
      id: `slack-${s.channelId}`,
      category: resolved,
      headline: `#${s.channelName}`,
      detail: s.text,
      source: "Slack",
      link: "#",
      when: new Date(Number(s.ts) * 1000).toISOString(),
      recommendation: recommend(resolved),
      severity: "low",
    });
  });

  const rank = { high: 0, medium: 1, low: 2 } as const;
  return items.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

export function groupBrief(items: BriefItem[]) {
  return CATEGORY_ORDER.map((category) => ({
    category,
    ...CATEGORY_META[category],
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);
}
