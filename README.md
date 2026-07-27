# Aide Intelligence

Marketing website for Aide Intelligence, built with [Next.js](https://nextjs.org) (App Router, TypeScript) and deployed to Netlify.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build locally
npm run lint    # ESLint
```

## Structure

The app splits into two route groups, which is why the dashboard has no marketing nav:

- `src/app/(site)/` — the marketing site (`platform`, `security`, `integrations`, `use-cases`, `about`, `contact`, `privacy`, `terms`, `thank-you`). Its layout supplies the header, footer and scroll reveals.
- `src/app/(app)/` — the product (`get-started`, `dashboard`). Its layout supplies a minimal header instead.
- `src/app/api/` — route handlers for Slack OAuth, the Slack proxy, and AI email summaries.
- `src/components/` — shared UI; `components/dashboard/` holds the dashboard.
- `src/lib/dashboard/` — the Google, Slack and Microsoft data loaders, plus formatting and triage helpers.
- `src/app/globals.css` — marketing styles. `src/styles/dashboard.css` is scoped under `.aide-dashboard` so its palette can't leak into the marketing pages.
- `public/` — logos, `robots.txt`, `sitemap.xml`, `site.webmanifest`

## Dashboard

`/get-started` collects a short intake and stores it in `localStorage` (nothing is sent anywhere); `/dashboard` reads it to personalise the greeting.

The dashboard connects to Google (Gmail, Calendar, Drive), Slack and Microsoft (Outlook, Calendar, OneDrive) **from the browser**. Tokens live in memory for the session only — reload and you reconnect. No workplace data is stored server-side.

Each connector needs credentials before its Connect button activates; see `.env.example` for what to set and where to get it. Without an `ANTHROPIC_API_KEY`, email triage still works using free client-side heuristics — the AI summaries just stay off.

## Demonstration request form

The form posts to Netlify Forms. Netlify's build bot only registers forms it finds in static HTML, which server-rendered pages do not provide, so the form fields are declared in `public/__forms.html` and `src/components/DemoForm.tsx` submits to that path before routing to `/thank-you`.

Submissions appear under **Forms** in the Netlify site dashboard. If the site moves off Netlify, replace the `fetch` target in `DemoForm.tsx` with the new endpoint and delete `public/__forms.html`.

## Before deployment

1. Replace the LinkedIn placeholder in `src/components/Footer.tsx`.
2. Review and complete the Privacy and Terms drafts with qualified legal advice.
3. Replace the example domain in `public/sitemap.xml`.
4. Confirm the final production contact details.
5. Add the production sitemap URL to `public/robots.txt`.
6. Set the environment variables from `.env.example` in Netlify, and register the production URL as an allowed origin / redirect URI with Google, Slack and Azure.
7. Test the final deployment using keyboard navigation, mobile devices and a current accessibility audit.

The supplied Aide Intelligence logo files are used without redesign.
