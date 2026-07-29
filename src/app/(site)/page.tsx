import Image from "next/image";
import Link from "next/link";
import CinematicHero from "@/components/CinematicHero";
import LogoMarquee from "@/components/LogoMarquee";
import DashboardTabs from "@/components/DashboardTabs";

import "@/styles/marquee.css";

export default function Home() {
  return (
    <>
      <CinematicHero />

      <div id="integrations" className="anchor-offset">
        <LogoMarquee />
      </div>

      <section className="trust-strip" aria-label="Aide Intelligence principles">
        <div className="shell trust-strip-inner">
          <p>Designed around a simple boundary:</p>
          <div>
            <span>01</span> Your data remains yours
          </div>
          <div>
            <span>02</span> Your access policies apply
          </div>
          <div>
            <span>03</span> Your leaders retain judgement
          </div>
        </div>
      </section>

      <section className="section product-intro" id="platform">
        <div className="shell section-heading reveal">
          <p className="eyebrow">
            <span></span> The platform
          </p>
          <h2>
            One operational view.
            <br />
            <em>Built from the systems you already use.</em>
          </h2>
          <p>
            Aide Intelligence structures selected workplace activity,
            operational data and relevant external information into a clear
            executive intelligence layer.
          </p>
        </div>
        <DashboardTabs />
      </section>

      <section className="section architecture-section">
        <div className="shell section-heading compact reveal">
          <p className="eyebrow">
            <span></span> Customer-controlled architecture
          </p>
          <h2>
            Clear intelligence.
            <br />
            <em>A defined data boundary.</em>
          </h2>
          <p>
            The software operates within the customer&rsquo;s authorised
            environment. Raw workplace data is not transferred to Aide
            Intelligence.
          </p>
        </div>
        <div className="shell architecture-map reveal">
          <div className="architecture-node source-node">
            <span>01</span>
            <div className="node-icon systems-icon" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <h3>Workplace systems</h3>
            <p>Selected activity and operational signals</p>
            <small>Teams · Slack · Microsoft 365 · Google Workspace</small>
          </div>
          <div className="architecture-route">
            <span>Selected signals</span>
            <i>
              <b></b>
            </i>
          </div>
          <div className="architecture-node cloud-node">
            <span>02</span>
            <div className="node-icon cloud-icon" aria-hidden="true">
              <i></i>
            </div>
            <h3>Your cloud environment</h3>
            <p>Processing, storage and access control</p>
            <small>Customer permissions · Customer keys · Customer retention</small>
          </div>
          <div className="architecture-route">
            <span>Structured insight</span>
            <i>
              <b></b>
            </i>
          </div>
          <div className="architecture-node output-node">
            <span>03</span>
            <div className="node-icon output-icon" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
            </div>
            <h3>Your Power BI dashboard</h3>
            <p>Executive intelligence and decision support</p>
            <small>Customer-defined users and access</small>
          </div>
        </div>
        <div className="shell boundary-statement reveal">
          <div>
            <Image src="/aide-mark.png" alt="" width={240} height={230} />
            <span>Data boundary</span>
          </div>
          <p>
            &ldquo;Aide Intelligence does not receive, inspect or store the
            customer&rsquo;s raw workplace data.&rdquo;
          </p>
          <Link href="/security">
            Review the security model <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="section security-preview">
        <div className="security-glow" aria-hidden="true"></div>
        <div className="shell security-preview-grid">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Security and control
            </p>
            <h2>
              Your environment.
              <br />
              Your data.
              <br />
              <em>Your control.</em>
            </h2>
            <p>
              Aide Intelligence is designed around customer-defined permissions,
              access policies and retention choices.
            </p>
            <Link className="secondary-button light" href="/security">
              Explore Security
            </Link>
          </div>
          <div className="control-console reveal">
            <div className="console-head">
              <span>Customer control plane</span>
              <small>Illustrative configuration</small>
            </div>
            <div className="console-row">
              <div>
                <i className="key-icon"></i>
                <span>
                  <strong>Credentials and access keys</strong>
                  <small>Held and managed by the customer</small>
                </span>
              </div>
              <b>Customer</b>
            </div>
            <div className="console-row">
              <div>
                <i className="lock-icon"></i>
                <span>
                  <strong>Encryption keys</strong>
                  <small>Remain under customer control</small>
                </span>
              </div>
              <b>Customer</b>
            </div>
            <div className="console-row">
              <div>
                <i className="user-icon"></i>
                <span>
                  <strong>User permissions</strong>
                  <small>Defined by authorised administrators</small>
                </span>
              </div>
              <b>Customer</b>
            </div>
            <div className="console-row">
              <div>
                <i className="clock-icon"></i>
                <span>
                  <strong>Data-retention policies</strong>
                  <small>Configured for organisational requirements</small>
                </span>
              </div>
              <b>Customer</b>
            </div>
            <div className="console-foot">
              <i></i>
              <span>
                Raw workplace data remains inside the authorised customer
                environment.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section intelligence-section">
        <div className="shell intelligence-grid">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Executive intelligence
            </p>
            <h2>From operational activity to executive clarity.</h2>
            <p>
              Objective signals help leadership teams understand organisational
              capacity, operating pressure and relevant external
              change&mdash;without reducing people to scores.
            </p>
          </div>
          <div className="intelligence-cards">
            <article className="feature-card reveal">
              <span>01</span>
              <div className="feature-visual line-visual" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>See capacity patterns</h3>
              <p>
                Identify where workload is rising, where capacity may be
                constrained and how operating patterns change over time.
              </p>
            </article>
            <article className="feature-card reveal">
              <span>02</span>
              <div className="feature-visual orbit-visual" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <b></b>
              </div>
              <h3>Recognise pressure points</h3>
              <p>
                Review communication, meeting and after-hours activity trends at
                an appropriate organisational level.
              </p>
            </article>
            <article className="feature-card reveal">
              <span>03</span>
              <div className="feature-visual signal-visual" aria-hidden="true">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <h3>Add relevant context</h3>
              <p>
                Combine internal operating signals with filtered news,
                competitor activity and external developments.
              </p>
            </article>
            <article className="feature-card reveal">
              <span>04</span>
              <div className="feature-visual focus-visual" aria-hidden="true">
                <i></i>
                <b></b>
              </div>
              <h3>Direct leadership attention</h3>
              <p>
                Structure information so decision-makers can identify what
                merits review, discussion or action.
              </p>
            </article>
          </div>
        </div>
        <div className="shell responsible-use reveal">
          <div>
            <span>Responsible use</span>
            <i></i>
          </div>
          <p>
            Aide Intelligence is intended to support responsible organisational
            decision-making. It is not designed for secret monitoring,
            individual productivity scoring, employee ranking or automated
            disciplinary decisions.
          </p>
        </div>
      </section>

      <section className="section assistant-section">
        <div className="shell assistant-layout">
          <div className="assistant-demo reveal">
            <div className="assistant-top">
              <span>
                <Image src="/aide-mark.png" alt="" width={240} height={230} />{" "}
                Aide Executive Brief
              </span>
              <small>08:30 · Wednesday</small>
            </div>
            <div className="assistant-message">
              <span>AI</span>
              <div>
                <p>
                  Good morning. Three changes may warrant attention before
                  today&rsquo;s operating meeting.
                </p>
                <ol>
                  <li>
                    <b>Delivery capacity:</b> sustained workload pressure is
                    concentrated in two teams.
                  </li>
                  <li>
                    <b>Leadership time:</b> meeting load increased materially in
                    Operations.
                  </li>
                  <li>
                    <b>External context:</b> a competitor announced an
                    adjacent-market expansion.
                  </li>
                </ol>
                <div className="assistant-actions">
                  <button type="button">View supporting signals</button>
                  <button type="button">Add to briefing</button>
                </div>
              </div>
            </div>
            <div className="assistant-input">
              <span>Ask about operational changes…</span>
              <i>↗</i>
            </div>
          </div>
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> Digital executive assistant
            </p>
            <h2>An intelligence layer for your working day.</h2>
            <p>
              Receive concise, evidence-linked summaries of changes that may
              warrant leadership attention. The assistant supports judgement; it
              does not make autonomous organisational decisions.
            </p>
            <ul className="clean-list">
              <li>Important operational changes</li>
              <li>Emerging organisational risks</li>
              <li>Company and competitor developments</li>
              <li>Meeting and workload patterns</li>
              <li>Concise executive summaries</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section use-case-section" id="use-cases">
        <div className="shell section-heading reveal">
          <p className="eyebrow">
            <span></span> Use cases
          </p>
          <h2>
            Designed for leaders responsible for operational performance.
          </h2>
        </div>
        <div className="shell use-case-grid">
          <Link
            className="use-case-card reveal"
            href="/use-cases#executive-oversight"
          >
            <span>01</span>
            <div>
              <h3>Executive Oversight</h3>
              <p>
                Maintain a clear view of organisational activity, emerging
                pressures and operational priorities.
              </p>
            </div>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link className="use-case-card reveal" href="/use-cases#capacity">
            <span>02</span>
            <div>
              <h3>Capacity and Workload</h3>
              <p>
                Identify patterns that may indicate uneven workloads,
                constrained teams or increasing after-hours activity.
              </p>
            </div>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link
            className="use-case-card reveal"
            href="/use-cases#decision-support"
          >
            <span>03</span>
            <div>
              <h3>Operational Decision Support</h3>
              <p>
                Use objective organisational signals to support planning,
                prioritisation and resource allocation.
              </p>
            </div>
            <b aria-hidden="true">↗</b>
          </Link>
          <Link className="use-case-card reveal" href="/use-cases#external">
            <span>04</span>
            <div>
              <h3>External Intelligence</h3>
              <p>
                Bring relevant news, competitor developments and market signals
                into the executive decision environment.
              </p>
            </div>
            <b aria-hidden="true">↗</b>
          </Link>
        </div>
      </section>

      <section className="section principles-section">
        <div className="shell principles-grid">
          <div className="section-heading compact reveal">
            <p className="eyebrow">
              <span></span> A deliberate operating model
            </p>
            <h2>Visibility without surrendering control.</h2>
          </div>
          <div className="principles-list reveal">
            <article>
              <span>01</span>
              <div>
                <h3>Customer-controlled</h3>
                <p>
                  Your organisation controls the environment, permissions and
                  data.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Privacy-conscious</h3>
                <p>
                  Raw workplace data is not received, inspected or stored by
                  Aide Intelligence.
                </p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Decision-focused</h3>
                <p>
                  Information is structured to help leaders identify what
                  requires attention.
                </p>
              </div>
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
            See your organisation
            <br />
            <em>more clearly.</em>
          </h2>
          <p>
            Discover how Aide Intelligence can create a secure,
            customer-controlled view of the signals that matter.
          </p>
          <div className="actions">
            <Link className="button" href="/contact">
              Request a Demonstration <span aria-hidden="true">↗</span>
            </Link>
            <Link className="secondary-button" href="/platform">
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
