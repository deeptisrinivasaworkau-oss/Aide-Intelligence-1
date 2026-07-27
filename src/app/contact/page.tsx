import type { Metadata } from "next";
import DemoForm from "@/components/DemoForm";

const description =
  "Request a demonstration of the Aide Intelligence secure, customer-controlled executive intelligence platform.";

export const metadata: Metadata = {
  title: "Request a Demonstration",
  description,
  openGraph: {
    title: "Request a Demonstration | Aide Intelligence",
    description,
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="contact-hero">
        <div className="hero-aurora" aria-hidden="true"></div>
        <div className="hero-grid-lines" aria-hidden="true"></div>
        <div className="shell contact-layout">
          <div className="contact-copy reveal">
            <p className="eyebrow">
              <span></span> Request a demonstration
            </p>
            <h1>
              See your organisation
              <br />
              <em>more clearly.</em>
            </h1>
            <p className="lede">
              Discuss how Aide Intelligence could create a secure,
              customer-controlled view of the workplace and external signals
              that matter to your leadership team.
            </p>
            <div className="contact-expect">
              <span>What to expect</span>
              <ol>
                <li>
                  <b>01</b>A focused discussion about your operational questions
                </li>
                <li>
                  <b>02</b>A review of relevant systems and information
                  boundaries
                </li>
                <li>
                  <b>03</b>A demonstration of the customer-controlled platform
                  model
                </li>
              </ol>
            </div>
          </div>
          <div className="form-panel reveal">
            <div className="form-panel-head">
              <span>Demonstration request</span>
              <small>Fields marked * are required</small>
            </div>
            <DemoForm />
          </div>
        </div>
      </section>

      <section className="contact-principles">
        <div className="shell trust-strip-inner">
          <p>Our approach:</p>
          <div>
            <span>01</span> Clear purpose
          </div>
          <div>
            <span>02</span> Defined information scope
          </div>
          <div>
            <span>03</span> Customer-controlled architecture
          </div>
        </div>
      </section>
    </>
  );
}
