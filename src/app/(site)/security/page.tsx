import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const description =
  "Review the customer-controlled architecture, data boundaries and access model of Aide Intelligence.";

export const metadata: Metadata = {
  title: "Security and Data Control",
  description,
  openGraph: {
    title: "Security and Data Control | Aide Intelligence",
    description,
  },
};

const controls = [
  {
    number: "01",
    title: "Data location",
    detail:
      "Workplace data remains within the customer's authorised cloud environment.",
    status: "Customer-controlled",
  },
  {
    number: "02",
    title: "Credentials and keys",
    detail:
      "Credentials, access keys and encryption keys remain under customer control.",
    status: "Customer-controlled",
  },
  {
    number: "03",
    title: "Permissions",
    detail: "Access is governed by customer-defined users, roles and permissions.",
    status: "Customer-defined",
  },
  {
    number: "04",
    title: "Retention",
    detail:
      "Data-retention policies are defined and administered by the customer.",
    status: "Customer-defined",
  },
  {
    number: "05",
    title: "Dashboard access",
    detail: "The customer controls who can access the resulting executive brief.",
    status: "Customer-controlled",
  },
];

export default function SecurityPage() {
  return (
    <>
      <section className="interior-hero">
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="shell interior-hero-grid">
          <div className="reveal">
            <p className="eyebrow">
              <span></span> Security and data control
            </p>
            <h1>
              Your environment. Your data.
              <br />
              <em>Your control.</em>
            </h1>
            <p className="lede">
              The architecture is designed so that raw workplace data remains
              within the customer&rsquo;s authorised cloud environment, governed
              by customer-defined permissions and policies.
            </p>
          </div>
          <div className="security-seal reveal">
            <Image src="/aide-mark.png" alt="" width={240} height={230} />
            <span>Customer-controlled architecture</span>
            <small>Defined data boundary</small>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell security-principle reveal">
          <span>Core principle</span>
          <p>
            &ldquo;Your systems remain the systems of record. Credentials stay in customer-controlled vaults, raw content is processed only as required, and retention, logs, models, subprocessors and deployment location are documented and configurable.&rdquo;
          </p>
        </div>
        <div className="shell control-matrix">
          {controls.map((control) => (
            <article className="reveal" key={control.number}>
              <span>{control.number}</span>
              <div>
                <h3>{control.title}</h3>
                <p>{control.detail}</p>
              </div>
              <b>{control.status}</b>
            </article>
          ))}
        </div>
      </section>

      <section className="section architecture-section">
        <div className="shell section-heading compact reveal">
          <p className="eyebrow">
            <span></span> Data flow
          </p>
          <h2>A clear route with a clear boundary.</h2>
          <p>
            Aide Intelligence provides and maintains the software layer. The
            customer retains control of the underlying environment, data and
            access policies.
          </p>
        </div>
        <div className="shell architecture-map reveal">
          <div className="architecture-node source-node">
            <span>01</span>
            <div className="node-icon systems-icon">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <h3>Authorised sources</h3>
            <p>Selected workplace and operational systems</p>
          </div>
          <div className="architecture-route">
            <span>Selected signals</span>
            <i>
              <b></b>
            </i>
          </div>
          <div className="architecture-node cloud-node">
            <span>02</span>
            <div className="node-icon cloud-icon">
              <i></i>
            </div>
            <h3>Customer environment</h3>
            <p>Storage, processing and policy enforcement</p>
          </div>
          <div className="architecture-route">
            <span>Structured output</span>
            <i>
              <b></b>
            </i>
          </div>
          <div className="architecture-node output-node">
            <span>03</span>
            <div className="node-icon output-icon">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <h3>the executive brief</h3>
            <p>Customer-controlled dashboard access</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-feature">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Conservative communication
            </p>
            <h2>Clear statements. No unsupported assurances.</h2>
          </div>
          <div className="prose reveal">
            <p>
              Security architecture should be assessed against the
              customer&rsquo;s environment, configuration and governance
              requirements. Aide Intelligence does not claim certifications,
              regulatory status or guarantees that have not been independently
              established.
            </p>
            <p>
              Detailed implementation discussions should define system scope,
              access design, data handling and operational responsibilities
              before deployment.
            </p>
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="cta-aurora" aria-hidden="true"></div>
        <div className="shell final-cta-inner reveal">
          <p className="eyebrow">
            <span></span> Review the architecture
          </p>
          <h2>
            Discuss your control
            <br />
            <em>and governance requirements.</em>
          </h2>
          <p>
            Request a focused demonstration of the customer-controlled data
            model.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Request a Demonstration <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-button" href="/platform">
              View Platform
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
