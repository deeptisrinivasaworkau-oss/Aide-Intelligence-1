/** Decode HTML entities that Gmail/Graph include in snippets (e.g. &#39; -> '). */
export function decodeEntities(value: string): string {
  if (!value) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

export function initials(name: string): string {
  if (!name) return "?";
  const base = name.split("<")[0].trim() || name;
  const parts = base.replace(/[^a-zA-Z0-9 @.]/g, "").split(/[\s.@]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

type Triageable = {
  sender?: string;
  subject?: string;
  snippet?: string;
  unread?: boolean;
};

/**
 * Free, no-setup action line — what to DO with the email. Runs entirely in the
 * browser off sender/subject/snippet signals. No API key, no cost. Order
 * matters: automated/newsletter senders are caught before the provider's
 * unreliable "important" flag, so a flagged newsletter doesn't say "reply".
 */
export function heuristicVerdict(item: Triageable): string {
  const from = (item.sender ?? "").toLowerCase();
  const body = `${item.subject ?? ""} ${item.snippet ?? ""}`.toLowerCase();

  const automated =
    /noreply|no-reply|donotreply|jobalerts|invitations?@|messaging-digest|notification|newsletter|mailer|updates?@|daily@|digest|linkedin\.com|unsubscribe/.test(
      from,
    ) ||
    /unsubscribe|view (this|in) (email )?(in )?browser|% off|newsletter|new jobs?|jobs? for you/.test(
      body,
    );
  const moneyDeadline =
    /invoice|overdue|payment (due|failed)|past due|final notice|action required|deadline|due (today|tomorrow|by |date)|expir/.test(
      body,
    );
  const directAsk =
    /\bcan you\b|\bcould you\b|\bplease\b|let me know|get back to me|waiting on|awaiting|respond|reply|confirm|are you available|when works|schedule|meeting/.test(
      body,
    );

  if (moneyDeadline) return "Handle today — mentions money or a deadline";
  if (automated) return "Skip — automated, no reply needed";
  if (directAsk) return "Reply when you get a chance";
  if (item.unread) return "Skim, then archive";
  return "Already read — no action";
}

/**
 * One line on WHAT the email says. Free, client-side: decodes entities, strips
 * the greeting, collapses whitespace, and keeps the first clean sentence. The
 * AI route produces a real summary; this is the no-cost approximation.
 */
export function contentSummary(item: Triageable): string {
  const subject = decodeEntities((item.subject ?? "").trim());
  let text = decodeEntities((item.snippet ?? "").trim());
  if (!text) return subject;

  // Drop a leading greeting like "Hi John," or "Hello team -"
  text = text
    .replace(
      /^(hi|hello|hey|dear|good (morning|afternoon|evening))\b[\s,]*[^,.\n]{0,30}[,.\-–:]\s*/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();

  const firstSentence = text.match(/^[^.!?]*[.!?]/)?.[0];
  let summary = (firstSentence ?? text).trim();
  if (summary.length > 100) summary = `${summary.slice(0, 97).trim()}…`;
  if (summary.length < 8) summary = subject || summary;
  return summary;
}

/** Base64url -> UTF-8 text (Gmail encodes body parts this way). */
export function b64urlDecode(data: string): string {
  try {
    const b64 = data.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return "";
  }
}
