import type { Metadata } from "next";

const description = "Privacy notice for the Aide Intelligence website.";

export const metadata: Metadata = {
  title: "Privacy",
  description,
  openGraph: { title: "Privacy | Aide Intelligence", description },
};

export default function PrivacyPage() {
  return (
    <>
      <section className="legal-hero">
        <div className="shell">
          <p className="eyebrow">
            <span></span> Legal
          </p>
          <h1>Privacy notice</h1>
          <p>Template for review before publication.</p>
        </div>
      </section>
      <section className="legal-content">
        <div className="shell legal-grid">
          <aside>
            <span>Last updated</span>
            <p>Not yet published</p>
            <div className="legal-warning">
              This draft requires review by an appropriately qualified legal
              adviser and completion with the organisation&rsquo;s actual
              contact, processing and retention details.
            </div>
          </aside>
          <article>
            <h2>1. Scope</h2>
            <p>
              This draft describes how information submitted through the Aide
              Intelligence website may be handled. It does not describe customer
              deployment data, which should be governed by separate contractual
              and implementation documentation.
            </p>
            <h2>2. Information submitted through the website</h2>
            <p>
              Demonstration or contact forms may request a name, work email
              address, organisation, role and information included in the
              message.
            </p>
            <h2>3. Purpose</h2>
            <p>
              Submitted information may be used to respond to enquiries, arrange
              demonstrations and maintain an appropriate record of business
              communications.
            </p>
            <h2>4. Service providers</h2>
            <p>
              The production version should identify the hosting,
              form-processing and communications providers actually used.
            </p>
            <h2>5. Retention</h2>
            <p>
              The production version should state the applicable retention
              periods or criteria used to determine them.
            </p>
            <h2>6. Rights and contact</h2>
            <p>
              The production version should provide the correct legal entity,
              jurisdiction-specific rights information and a monitored privacy
              contact address.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
