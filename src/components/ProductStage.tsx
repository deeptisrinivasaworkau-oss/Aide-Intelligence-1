"use client";

import { useRef } from "react";
import Image from "next/image";

const RESTING_TRANSFORM = "rotateY(-3deg) rotateX(1deg)";

export default function ProductStage() {
  const windowRef = useRef<HTMLDivElement>(null);

  const canTilt = () =>
    typeof window !== "undefined" &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    matchMedia("(pointer:fine)").matches;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!windowRef.current || !canTilt()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    windowRef.current.style.transform = `rotateY(${x * 4 - 2}deg) rotateX(${-y * 3 + 1}deg) translateY(-2px)`;
  };

  const handlePointerLeave = () => {
    if (!windowRef.current) return;
    windowRef.current.style.transform = RESTING_TRANSFORM;
  };

  return (
    <div
      className="product-stage reveal"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="stage-orbit stage-orbit-one" aria-hidden="true"></div>
      <div className="stage-orbit stage-orbit-two" aria-hidden="true"></div>
      <div
        ref={windowRef}
        className="dashboard-window"
        aria-label="Illustrative Aide Intelligence executive dashboard"
      >
        <div className="window-bar">
          <div className="window-dots" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <span>Executive Operations Overview</span>
          <div className="secure-state">
            <i></i> Customer environment
          </div>
        </div>
        <div className="dashboard-shell">
          <aside className="dash-nav" aria-hidden="true">
            <Image src="/aide-mark.png" alt="" width={240} height={230} />
            <i className="active"></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </aside>
          <div className="dash-main">
            <div className="dash-head">
              <div>
                <small>Wednesday · 08:30</small>
                <strong>Good morning, Alex.</strong>
              </div>
              <span>Last refreshed 4 min ago</span>
            </div>
            <div className="metric-row">
              <article>
                <small>Operational load</small>
                <strong>72%</strong>
                <div className="micro-line">
                  <i style={{ "--w": "72%" } as React.CSSProperties}></i>
                </div>
                <span className="metric-note">Stable this week</span>
              </article>
              <article>
                <small>Capacity signal</small>
                <strong>18%</strong>
                <div className="micro-line">
                  <i style={{ "--w": "18%" } as React.CSSProperties}></i>
                </div>
                <span className="metric-note positive">+4% available</span>
              </article>
              <article>
                <small>Items for attention</small>
                <strong>06</strong>
                <div className="metric-sparks" aria-hidden="true">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
                <span className="metric-note">2 high priority</span>
              </article>
            </div>
            <div className="dash-grid">
              <article className="chart-card">
                <div className="card-head">
                  <div>
                    <small>Organisational capacity</small>
                    <strong>Six-week operating pattern</strong>
                  </div>
                  <span>All functions</span>
                </div>
                <svg
                  className="capacity-chart"
                  viewBox="0 0 560 210"
                  role="img"
                  aria-label="Illustrative capacity trend chart"
                >
                  <defs>
                    <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#62cfff" stopOpacity=".28" />
                      <stop offset="1" stopColor="#715cff" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="stroke" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#62cfff" />
                      <stop offset="1" stopColor="#8672ff" />
                    </linearGradient>
                  </defs>
                  <g className="grid">
                    <path d="M25 30H535M25 75H535M25 120H535M25 165H535" />
                    <path d="M25 20V175M127 20V175M229 20V175M331 20V175M433 20V175M535 20V175" />
                  </g>
                  <path
                    className="area"
                    d="M25 142 C70 134 88 105 127 112 S194 144 229 118 S298 65 331 79 S400 112 433 86 S500 56 535 61 L535 175 L25 175 Z"
                  />
                  <path
                    className="series"
                    d="M25 142 C70 134 88 105 127 112 S194 144 229 118 S298 65 331 79 S400 112 433 86 S500 56 535 61"
                  />
                  <g className="points">
                    <circle cx="25" cy="142" r="4" />
                    <circle cx="127" cy="112" r="4" />
                    <circle cx="229" cy="118" r="4" />
                    <circle cx="331" cy="79" r="4" />
                    <circle cx="433" cy="86" r="4" />
                    <circle cx="535" cy="61" r="4" />
                  </g>
                  <g className="labels">
                    <text x="25" y="201">W1</text>
                    <text x="127" y="201">W2</text>
                    <text x="229" y="201">W3</text>
                    <text x="331" y="201">W4</text>
                    <text x="433" y="201">W5</text>
                    <text x="525" y="201">W6</text>
                  </g>
                </svg>
              </article>
              <article className="attention-card">
                <div className="card-head">
                  <div>
                    <small>Leadership attention</small>
                    <strong>Current signals</strong>
                  </div>
                  <span>6 items</span>
                </div>
                <div className="signal-item high">
                  <i></i>
                  <div>
                    <strong>Delivery team capacity</strong>
                    <small>Pressure rising over 12 days</small>
                  </div>
                  <b>High</b>
                </div>
                <div className="signal-item">
                  <i></i>
                  <div>
                    <strong>After-hours activity</strong>
                    <small>Concentrated in two functions</small>
                  </div>
                  <b>Review</b>
                </div>
                <div className="signal-item">
                  <i></i>
                  <div>
                    <strong>Market development</strong>
                    <small>Competitor announcement detected</small>
                  </div>
                  <b>New</b>
                </div>
                <div className="brief-note">
                  <span>AI</span>
                  <p>
                    Three material changes are recommended for review before
                    today&rsquo;s operating meeting.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
      <div className="stage-caption">
        <span>
          <i></i> Illustrative interface
        </span>
        <span>Source-linked executive view</span>
      </div>
    </div>
  );
}
