import type { Metadata } from "next";

const description = "Website terms for Aide Intelligence.";

export const metadata: Metadata = {
  title: "Terms",
  description,
  openGraph: { title: "Terms | Aide Intelligence", description },
};

export default function TermsPage() {
  return (
    <>
      <section className="legal-hero">
        <div className="shell">
          <p className="eyebrow">
            <span></span> Legal
          </p>
          <h1>Website terms</h1>
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
              adviser and completion with the organisation&rsquo;s actual legal
              entity and jurisdiction details.
            </div>
          </aside>
          <article>
            <h2>1. Website information</h2>
            <p>
              Information on this website is provided for general business
              information and does not constitute legal, employment, security or
              professional advice.
            </p>
            <h2>2. Product descriptions</h2>
            <p>
              Descriptions are high-level and subject to the scope,
              configuration and terms agreed for any customer implementation.
            </p>
            <h2>3. Decision support</h2>
            <p>
              Aide Intelligence provides decision-support information.
              Organisational and employment decisions should remain subject to
              appropriate context, governance and human review.
            </p>
            <h2>4. Intellectual property</h2>
            <p>
              The production terms should identify ownership and permitted use
              of website content, branding and product materials.
            </p>
            <h2>5. Liability</h2>
            <p>
              Appropriate limitations and exclusions should be drafted for the
              relevant jurisdiction and business model.
            </p>
            <h2>6. Governing law</h2>
            <p>
              The production terms should specify the applicable law and courts
              or dispute-resolution process.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
