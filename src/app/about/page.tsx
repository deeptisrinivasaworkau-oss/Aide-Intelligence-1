import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const description =
  "Learn about Aide Intelligence and its customer-controlled approach to secure operational intelligence.";

export const metadata: Metadata = {
  title: "About",
  description,
  openGraph: { title: "About | Aide Intelligence", description },
};

const values = [
  {
    number: "01",
    title: "Clarity",
    detail:
      "Present information in a form that helps leaders distinguish material signals from background activity.",
  },
  {
    number: "02",
    title: "Control",
    detail:
      "Design the operating model around customer ownership of data, environment, permissions and access.",
  },
  {
    number: "03",
    title: "Restraint",
    detail:
      "Use precise language, proportionate information and human review rather than exaggerated automation claims.",
  },
  {
    number: "04",
    title: "Responsibility",
    detail:
      "Support legitimate organisational decision-making without encouraging surveillance or automated employment judgements.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="interior-hero">
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="shell interior-hero-grid">
          <div className="reveal">
            <p className="eyebrow">
              <span></span> About Aide Intelligence
            </p>
            <h1>
              Better visibility,
              <br />
              <em>without surrendering control.</em>
            </h1>
            <p className="lede">
              Aide Intelligence develops secure operational intelligence
              software for organisations that require a clearer view of
              capacity, workload and emerging business risk.
            </p>
          </div>
          <div className="about-mark reveal">
            <Image
              src="/aide-mark.png"
              alt="Aide Intelligence brand mark"
              width={240}
              height={230}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell about-statement reveal">
          <span>Our purpose</span>
          <p>
            Help leaders recognise meaningful patterns, understand
            organisational capacity and make more informed
            decisions&mdash;while preserving control of their data and
            environment.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell values-grid">
          {values.map((value) => (
            <article className="reveal" key={value.number}>
              <span>{value.number}</span>
              <h2>{value.title}</h2>
              <p>{value.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="shell split-feature">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Who it is for
            </p>
            <h2>Leaders accountable for operational performance.</h2>
          </div>
          <div className="audience-list reveal">
            <article>
              <span>01</span>
              <h3>SME owners and managing directors</h3>
            </article>
            <article>
              <span>02</span>
              <h3>Chief operating officers</h3>
            </article>
            <article>
              <span>03</span>
              <h3>Department and functional leaders</h3>
            </article>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="cta-aurora" aria-hidden="true"></div>
        <div className="shell final-cta-inner reveal">
          <p className="eyebrow">
            <span></span> A clearer operating view
          </p>
          <h2>
            Discuss what better
            <br />
            <em>visibility could change.</em>
          </h2>
          <p>Request a focused introduction to Aide Intelligence.</p>
          <div className="actions">
            <Link className="button" href="/contact">
              Request a Demonstration <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-button" href="/platform">
              Explore Platform
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
