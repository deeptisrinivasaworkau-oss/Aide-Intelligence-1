import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const description =
  "Explore workplace, operational and external information integrations supported by Aide Intelligence.";

export const metadata: Metadata = {
  title: "Integrations",
  description,
  openGraph: { title: "Integrations | Aide Intelligence", description },
};

const integrationGroups = [
  {
    number: "01",
    title: "Communication",
    detail: "Selected organisational communication signals.",
    items: ["Microsoft Teams", "Slack"],
  },
  {
    number: "02",
    title: "Email",
    detail:
      "Selected email metadata or signals, subject to customer configuration.",
    items: ["Outlook", "Gmail"],
  },
  {
    number: "03",
    title: "Documents",
    detail: "Relevant document and file activity from authorised locations.",
    items: ["SharePoint", "OneDrive", "Google Drive"],
  },
  {
    number: "04",
    title: "Meetings and calendars",
    detail: "Patterns in meeting load, scheduling and collaboration.",
    items: [
      "Outlook Calendar",
      "Microsoft Teams",
      "Google Calendar",
      "Google Meet",
    ],
  },
  {
    number: "05",
    title: "Structured records",
    detail: "Selected operational data maintained in common working formats.",
    items: ["Excel", "Google Sheets"],
  },
];

const externalCards = [
  {
    number: "01",
    title: "Company-relevant news",
    detail:
      "Developments with a plausible connection to the organisation, its customers or its operating environment.",
  },
  {
    number: "02",
    title: "Industry developments",
    detail:
      "Material changes, announcements and trends relevant to the company's sector.",
  },
  {
    number: "03",
    title: "Competitor activity",
    detail:
      "Public competitor developments that may warrant commercial or operational review.",
  },
  {
    number: "04",
    title: "Market and operational signals",
    detail:
      "Selected external information that adds useful context to internal operating patterns.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <section className="interior-hero">
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="shell interior-hero-grid">
          <div className="reveal">
            <p className="eyebrow">
              <span></span> Integrations
            </p>
            <h1>
              Built around the systems
              <br />
              <em>your organisation already uses.</em>
            </h1>
            <p className="lede">
              Aide Intelligence can connect selected workplace, collaboration,
              document, calendar and spreadsheet systems, together with relevant
              public information.
            </p>
          </div>
          <div className="integration-orbit reveal" aria-hidden="true">
            <i>Teams</i>
            <i>Slack</i>
            <i>Outlook</i>
            <i>Drive</i>
            <i>Calendar</i>
            <span>
              <Image src="/aide-mark.png" alt="" width={240} height={230} />
            </span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell section-heading reveal">
          <p className="eyebrow">
            <span></span> Workplace systems
          </p>
          <h2>Selected connections. Defined purpose.</h2>
          <p>
            Integration scope should be agreed with the customer and limited to
            systems and information necessary for the intended executive view.
          </p>
        </div>
        <div className="shell integration-catalog">
          {integrationGroups.map((group) => (
            <article className="integration-group reveal" key={group.number}>
              <span>{group.number}</span>
              <div>
                <h3>{group.title}</h3>
                <p>{group.detail}</p>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section external-section">
        <div className="shell external-grid">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> External intelligence
            </p>
            <h2>Relevant developments, brought into context.</h2>
            <p>
              The platform can collect and organise selected public information
              that may affect executive decisions.
            </p>
          </div>
          <div className="external-cards">
            {externalCards.map((card) => (
              <article className="reveal" key={card.number}>
                <span>{card.number}</span>
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-feature">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Implementation discipline
            </p>
            <h2>Connect only what is relevant.</h2>
          </div>
          <div className="prose reveal">
            <p>
              More data does not automatically produce better intelligence.
              Integration design should begin with defined leadership questions,
              proportionate access and clear information boundaries.
            </p>
            <p>
              Available integrations and implementation details depend on the
              customer&rsquo;s systems, permissions and chosen scope.
            </p>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="cta-aurora" aria-hidden="true"></div>
        <div className="shell final-cta-inner reveal">
          <p className="eyebrow">
            <span></span> Map your environment
          </p>
          <h2>
            Start with the systems
            <br />
            <em>that matter.</em>
          </h2>
          <p>
            Review potential sources and define a proportionate integration
            scope.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Request a Demonstration <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-button" href="/security">
              Review Security
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
