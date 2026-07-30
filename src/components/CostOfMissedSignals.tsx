/**
 * "Missed signals have a real cost" — the commercial case that justifies the
 * price, taken from the investor deck.
 *
 * NOTE ON SOURCING: these three figures are not in the business plan and could
 * not be verified here. The plan's own methodology (§ Evidence hierarchy)
 * requires FACT claims to be cited. The first one names a real company and
 * asserts a financial provision, so it must carry a citation before this page
 * is published. `source` renders as a visible footnote — fill it in or remove
 * the stat.
 */

const STATS = [
  {
    figure: "€457.7m",
    body: "Heraeus provision after whistleblower-exposed irregularities",
    accent: "violet",
    source: "",
  },
  {
    figure: "US$75m",
    body: "at risk per US$1bn project spend from ineffective communications",
    accent: "amber",
    source: "",
  },
  {
    figure: "275/day",
    body: "meetings, emails or chats for highest-volume users",
    accent: "cyan",
    source: "",
  },
];

export default function CostOfMissedSignals() {
  const uncited = STATS.filter((s) => !s.source).length;

  return (
    <section className="section cost-section">
      <div className="shell">
        <div className="section-heading compact reveal">
          <p className="eyebrow">
            <span></span> The problem
          </p>
          <h2>
            Missed signals have
            <br />
            <em>a real cost.</em>
          </h2>
          <p>
            Executives do not lack data. They lack a trusted filter for what
            requires action.
          </p>
        </div>

        <div className="cost-grid reveal">
          {STATS.map((stat) => (
            <article className={`cost-card cost-${stat.accent}`} key={stat.figure}>
              <p className="cost-figure">{stat.figure}</p>
              <p className="cost-body">{stat.body}</p>
              {stat.source && <p className="cost-source">{stat.source}</p>}
            </article>
          ))}
        </div>

        <div className="cost-implication reveal">
          <span>Investor implication</span>
          <p>
            This is an escalation and decision-risk problem — not another
            dashboard problem.
          </p>
        </div>

        {uncited > 0 && (
          <p className="cost-todo reveal">
            Sources required for {uncited} figure{uncited > 1 ? "s" : ""} above
            before publication.
          </p>
        )}
      </div>
    </section>
  );
}
