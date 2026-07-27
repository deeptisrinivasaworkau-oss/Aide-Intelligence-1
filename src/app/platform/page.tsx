import type { Metadata } from "next";
import Link from "next/link";

const description =
  "Explore the Aide Intelligence platform for secure, customer-controlled executive and workplace intelligence.";

export const metadata: Metadata = {
  title: "Platform",
  description,
  openGraph: { title: "Platform | Aide Intelligence", description },
};

export default function PlatformPage() {
  return (
    <>
      <section className="interior-hero">
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="shell interior-hero-grid">
          <div className="reveal">
            <p className="eyebrow">
              <span></span> Platform
            </p>
            <h1>
              Operational intelligence,
              <br />
              <em>structured for leadership.</em>
            </h1>
            <p className="lede">
              Aide Intelligence connects selected organisational and external
              signals, processes them within the customer&rsquo;s authorised
              environment and presents them through a customer-controlled Power
              BI view.
            </p>
          </div>
          <div className="interior-hero-aside reveal">
            <span>Platform model</span>
            <ol>
              <li>
                <b>01</b>Connect selected systems
              </li>
              <li>
                <b>02</b>Structure relevant signals
              </li>
              <li>
                <b>03</b>Present executive insight
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell section-heading reveal">
          <p className="eyebrow">
            <span></span> What the platform does
          </p>
          <h2>A coherent view of capacity, workload and change.</h2>
          <p>
            The platform is designed to reduce fragmentation in executive
            information. It brings together selected evidence while preserving
            the customer&rsquo;s control of data, permissions and access.
          </p>
        </div>
        <div className="shell detail-grid">
          <article className="detail-card reveal">
            <span>01</span>
            <h3>Connect</h3>
            <p>
              Connect selected workplace systems, operational records and public
              information sources relevant to the organisation.
            </p>
          </article>
          <article className="detail-card reveal">
            <span>02</span>
            <h3>Process</h3>
            <p>
              Structure signals inside the customer&rsquo;s authorised cloud
              environment according to defined access and retention policies.
            </p>
          </article>
          <article className="detail-card reveal">
            <span>03</span>
            <h3>Interpret</h3>
            <p>
              Organise patterns into executive-level views of capacity,
              workload, communication and external change.
            </p>
          </article>
          <article className="detail-card reveal">
            <span>04</span>
            <h3>Present</h3>
            <p>
              Deliver customer-controlled Power BI dashboards and concise
              decision-support summaries.
            </p>
          </article>
        </div>
      </section>

      <section className="section page-feature">
        <div className="shell page-feature-grid">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Executive view
            </p>
            <h2>Information designed around leadership attention.</h2>
            <p>
              Dashboards can be structured to show organisational patterns,
              material changes and relevant context without presenting automated
              judgements about individuals.
            </p>
            <ul className="clean-list">
              <li>Workload and capacity trends</li>
              <li>Communication and meeting patterns</li>
              <li>After-hours activity trends</li>
              <li>Operational pressure points</li>
              <li>Relevant external developments</li>
              <li>Concise leadership summaries</li>
            </ul>
          </div>
          <div className="product-mini reveal">
            <div className="product-mini-head">
              <span>Operational intelligence</span>
              <small>Customer view</small>
            </div>
            <div className="product-mini-metrics">
              <article>
                <small>Capacity</small>
                <strong>68%</strong>
              </article>
              <article>
                <small>Pressure</small>
                <strong>Moderate</strong>
              </article>
              <article>
                <small>Attention</small>
                <strong>04</strong>
              </article>
            </div>
            <svg
              viewBox="0 0 600 245"
              role="img"
              aria-label="Illustrative operational trend"
            >
              <defs>
                <linearGradient id="pstroke" x1="0" x2="1">
                  <stop stopColor="#61d2ff" />
                  <stop offset="1" stopColor="#8d77ff" />
                </linearGradient>
              </defs>
              <g className="grid">
                <path d="M25 45H575M25 100H575M25 155H575M25 210H575" />
              </g>
              <path
                className="series"
                stroke="url(#pstroke)"
                d="M25 177 C80 167 100 137 150 145 S230 177 280 127 S365 69 410 94 S500 121 575 63"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-feature">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Responsible interpretation
            </p>
            <h2>Objective signals. Human judgement.</h2>
          </div>
          <div className="prose reveal">
            <p>
              Aide Intelligence is intended to support planning, prioritisation
              and resource allocation. It can help leaders recognise where
              further review may be warranted.
            </p>
            <p>
              It should not be used as the sole basis for organisational or
              employment decisions. Context, appropriate governance and human
              review remain essential.
            </p>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="cta-aurora" aria-hidden="true"></div>
        <div className="shell final-cta-inner reveal">
          <p className="eyebrow">
            <span></span> Explore the operating model
          </p>
          <h2>
            See how the platform
            <br />
            <em>fits your environment.</em>
          </h2>
          <p>
            Discuss your systems, information priorities and customer-control
            requirements with Aide Intelligence.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Request a Demonstration <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-button" href="/integrations">
              Review Integrations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
