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

- `src/app/` — one folder per route (`platform`, `security`, `integrations`, `use-cases`, `about`, `contact`, `privacy`, `terms`, `thank-you`), plus `layout.tsx` for the shared shell and `not-found.tsx` for 404s
- `src/components/` — shared UI: `Header`, `Footer`, and the client components handling scroll reveals, dashboard tabs, the hero tilt effect and the demo request form
- `src/app/globals.css` — the full stylesheet
- `public/` — logos, `robots.txt`, `sitemap.xml`, `site.webmanifest`

## Demonstration request form

The form posts to Netlify Forms. Netlify's build bot only registers forms it finds in static HTML, which server-rendered pages do not provide, so the form fields are declared in `public/__forms.html` and `src/components/DemoForm.tsx` submits to that path before routing to `/thank-you`.

Submissions appear under **Forms** in the Netlify site dashboard. If the site moves off Netlify, replace the `fetch` target in `DemoForm.tsx` with the new endpoint and delete `public/__forms.html`.

## Before deployment

1. Replace the LinkedIn placeholder in `src/components/Footer.tsx`.
2. Review and complete the Privacy and Terms drafts with qualified legal advice.
3. Replace the example domain in `public/sitemap.xml`.
4. Confirm the final production contact details.
5. Add the production sitemap URL to `public/robots.txt`.
6. Test the final deployment using keyboard navigation, mobile devices and a current accessibility audit.

The supplied Aide Intelligence logo files are used without redesign.
