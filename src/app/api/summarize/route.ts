import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";
import { z } from "zod";

// Reads each email's full body and returns, per email, one line on what it says
// plus one line on what to do with it. Stateless — nothing is stored.
//
// Requires ANTHROPIC_API_KEY. Without it the route reports "not_configured" and
// the dashboard silently falls back to its free heuristic lines.

const ResultsSchema = z.object({
  results: z.array(
    z.object({
      summary: z.string(),
      action: z.string(),
    }),
  ),
});

type EmailInput = { sender?: string; subject?: string; body?: string };

const PROMPT_HEADER = `You are triaging an inbox for a busy small-business owner. You are given the FULL text of each email. For each one, return two things:
- "summary": ONE plain sentence (max ~15 words) saying what the email actually says. Be specific and concrete — names, amounts, dates, the actual ask. Not "a newsletter about X" but the gist itself.
- "action": a short phrase (max ~8 words) telling them what to do, e.g. "Reply today — client waiting", "Skip, promotional", "Pay invoice by Friday", "No action needed", "Skim when free".

Return one entry per email, in the same order as the input.

Emails:
`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      error: "not_configured",
      message: "ANTHROPIC_API_KEY is not set.",
    });
  }

  let emails: EmailInput[];
  try {
    emails = (await request.json()).emails;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!Array.isArray(emails) || emails.length === 0) {
    return NextResponse.json({ error: "no_emails" }, { status: 400 });
  }

  // Cap batch size and per-email body length to keep latency and cost bounded.
  const batch = emails.slice(0, 20).map((email, id) => ({
    id,
    from: String(email.sender ?? "").slice(0, 200),
    subject: String(email.subject ?? "").slice(0, 300),
    body: String(email.body ?? "").slice(0, 4000),
  }));

  const client = new Anthropic({ apiKey });

  try {
    // Haiku is deliberate here: this runs over every inbox refresh, and the task
    // is short-form triage rather than deep reasoning.
    const response = await client.messages.parse({
      model: "claude-haiku-4-5",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: PROMPT_HEADER + JSON.stringify(batch, null, 2),
        },
      ],
      output_config: { format: zodOutputFormat(ResultsSchema) },
    });

    return NextResponse.json({ results: response.parsed_output?.results ?? [] });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "anthropic_error", detail: String(error.message).slice(0, 300) },
        { status: 502 },
      );
    }
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
