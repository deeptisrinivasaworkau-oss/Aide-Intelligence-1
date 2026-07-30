import { timeAgo } from "@/lib/dashboard/format";
import { groupBrief, type BriefItem } from "@/lib/dashboard/brief";

function whenLabel(when: string | null) {
  if (!when) return "";
  const ts = new Date(when).getTime();
  if (ts > Date.now()) {
    const hours = Math.round((ts - Date.now()) / 3_600_000);
    return hours < 1 ? "within the hour" : `in ${hours}h`;
  }
  return timeAgo(when);
}

/**
 * The prioritised briefing: grouped by what the item demands of the reader,
 * highest severity first, every row linked back to the system it came from.
 */
export default function Brief({ items }: { items: BriefItem[] }) {
  const groups = groupBrief(items);

  if (groups.length === 0) {
    return (
      <div className="brief-empty">
        Nothing needs your attention right now.
      </div>
    );
  }

  return (
    <div className="brief">
      {groups.map((group) => (
        <section className="brief-group" key={group.category}>
          <header className="brief-group-head">
            <h2>{group.label}</h2>
            <span className="brief-count">{group.items.length}</span>
            <p>{group.blurb}</p>
          </header>

          <ul className="brief-items">
            {group.items.map((item) => (
              <li className={`brief-item sev-${item.severity}`} key={item.id}>
                <div className="brief-main">
                  <p className="brief-headline">{item.headline}</p>
                  <p className="brief-detail">{item.detail}</p>
                  <p className="brief-rec">
                    <span aria-hidden="true">→</span> {item.recommendation}
                  </p>
                </div>
                <div className="brief-meta">
                  {/* Traceability is the product promise, so the source is a
                      link, not a label. */}
                  <a
                    className="brief-source"
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.source}
                  </a>
                  <span className="brief-when">{whenLabel(item.when)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
