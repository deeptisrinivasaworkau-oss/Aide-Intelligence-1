"use client";

import { useState } from "react";
import { timeAgo } from "@/lib/dashboard/format";
import { groupBrief, type BriefCategory, type BriefItem } from "@/lib/dashboard/brief";

/** Items shown before a box needs opening. Keeps the summary to one screen. */
const COLLAPSED_LIMIT = 2;

function whenLabel(when: string | null) {
  if (!when) return "";
  const ts = new Date(when).getTime();
  if (ts > Date.now()) {
    const hours = Math.round((ts - Date.now()) / 3_600_000);
    return hours < 1 ? "< 1h" : `in ${hours}h`;
  }
  return timeAgo(when);
}

/**
 * The prioritised briefing: one box per category, side by side, sized so the
 * whole summary fits a single screen. Each box shows its most severe items and
 * opens in place rather than pushing the page taller.
 */
export default function Brief({ items }: { items: BriefItem[] }) {
  const [open, setOpen] = useState<BriefCategory[]>([]);
  const groups = groupBrief(items);

  const toggle = (category: BriefCategory) =>
    setOpen((current) =>
      current.includes(category)
        ? current.filter((c) => c !== category)
        : [...current, category],
    );

  if (groups.length === 0) {
    return <div className="brief-empty">Nothing needs your attention right now.</div>;
  }

  return (
    <div className="brief-grid">
      {groups.map((group) => {
        const isOpen = open.includes(group.category);
        const visible = isOpen ? group.items : group.items.slice(0, COLLAPSED_LIMIT);
        const hidden = group.items.length - visible.length;

        return (
          <section
            className={`brief-box${isOpen ? " open" : ""}`}
            key={group.category}
          >
            <header className="brief-box-head">
              <h2>{group.label}</h2>
              <span className="brief-count">{group.items.length}</span>
            </header>

            <ul className="brief-items">
              {visible.map((item) => (
                <li className={`brief-item sev-${item.severity}`} key={item.id}>
                  <p className="brief-headline">{item.headline}</p>
                  <p className="brief-rec">
                    <span aria-hidden="true">→</span> {item.recommendation}
                  </p>
                  <p className="brief-foot">
                    {/* Traceability is the product promise, so the source is a
                        link back to the originating system, not a label. */}
                    <a
                      className="brief-source"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.source}
                    </a>
                    <span className="brief-when">{whenLabel(item.when)}</span>
                  </p>
                </li>
              ))}
            </ul>

            {(hidden > 0 || isOpen) && (
              <button
                className="brief-more"
                type="button"
                onClick={() => toggle(group.category)}
                aria-expanded={isOpen}
              >
                {isOpen ? "Show less" : `Tap to read ${hidden} more`}
              </button>
            )}
          </section>
        );
      })}
    </div>
  );
}
