import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Aide Intelligence is priced against the systems you connect, the people who use it and the environment it runs in. Request a quote.";

export const metadata: Metadata = {
  title: "Pricing",
  description,
  openGraph: { title: "Pricing | Aide Intelligence", description },
};

// No published tiers: pricing depends on the customer's environment, and
// inventing numbers here would misrepresent the business.
const FACTORS = [
  {
    n: "01",
    title: "Systems connected",
    body: "Which sources are in scope — communication, email, documents, calendars, structured records and external intelligence.",
  },
  {
    n: "02",
    title: "People with access",
    body: "How many leaders and functions consume the executive view, and how access is segmented between them.",
  },
  {
    n: "03",
    title: "Your environment",
    body: "The platform runs inside your authorised cloud, so infrastructure, retention and access policies stay under your control and your account.",
  },
  {
    n: "04",
    title: "Implementation scope",
    body: "Integration design, dashboard configuration and the governance review that precedes deployment.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="interior-hero">
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="shell interior-hero-grid">
          <div className="reveal">
            <p className="eyebrow">
              <span></span> Pricing
            </p>
            <h1>
              Priced against
              <br />
              <em>your environment.</em>
            </h1>
            <p className="lede">
              Aide Intelligence deploys inside your own cloud and connects only
              the systems you authorise. Because scope differs materially between
              organisations, pricing is quoted rather than listed.
            </p>
          </div>
          <div className="interior-hero-aside reveal">
            <span>What a quote covers</span>
            <ol>
              <li>
                <b>01</b>Agreed integration scope
              </li>
              <li>
                <b>02</b>Users and access design
              </li>
              <li>
                <b>03</b>Implementation and review
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell section-heading reveal">
          <p className="eyebrow">
            <span></span> What shapes the number
          </p>
          <h2>Four things determine cost.</h2>
          <p>
            We would rather scope this properly than quote a figure that changes
            once we understand your systems.
          </p>
        </div>
        <div className="shell detail-grid">
          {FACTORS.map(({ n, title, body }) => (
            <article className="detail-card reveal" key={n}>
              <span>{n}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section final-cta">
        <div className="cta-aurora" aria-hidden="true"></div>
        <div className="shell final-cta-inner reveal">
          <p className="eyebrow">
            <span></span> Request a quote
          </p>
          <h2>
            Tell us your scope,
            <br />
            <em>we&rsquo;ll tell you the cost.</em>
          </h2>
          <p>
            A short conversation about your systems and the questions you need
            answered is enough for us to put a number against it.
          </p>
          <div className="actions">
            <Link className="button" href="/try-aide">
              Try Aide <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-button" href="/contact">
              Request a Demonstration
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
