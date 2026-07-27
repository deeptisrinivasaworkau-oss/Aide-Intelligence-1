"use client";

import { useState } from "react";

const tabs = [
  {
    id: "capacity",
    number: "01",
    title: "Capacity and workload",
    blurb:
      "Recognise shifts in organisational load before they become persistent constraints.",
  },
  {
    id: "attention",
    number: "02",
    title: "Leadership attention",
    blurb:
      "Surface material operational changes and prioritise what warrants review.",
  },
  {
    id: "external",
    number: "03",
    title: "External context",
    blurb:
      "Bring relevant company, competitor and market developments into the same decision environment.",
  },
];

const capacityBars = [
  { label: "Operations", value: 82 },
  { label: "Client delivery", value: 74 },
  { label: "Commercial", value: 58 },
  { label: "Finance", value: 46 },
];

const attentionItems = [
  {
    number: "01",
    title: "Client delivery workload",
    detail:
      "Activity has remained above the recent baseline for 12 consecutive days.",
    status: "High",
  },
  {
    number: "02",
    title: "Meeting concentration",
    detail:
      "Senior leadership meeting time increased in two business-critical functions.",
    status: "Review",
  },
  {
    number: "03",
    title: "External operating signal",
    detail:
      "A relevant competitor announced a change that may affect near-term positioning.",
    status: "New",
  },
];

const externalFeed = [
  {
    kind: "Industry development",
    headline: "New operating guidance may affect supplier lead times",
    relevance: "Relevance: Operations",
  },
  {
    kind: "Competitor activity",
    headline: "Product expansion announced in an adjacent market",
    relevance: "Relevance: Commercial",
  },
  {
    kind: "Company signal",
    headline: "Customer sentiment shift detected across selected public sources",
    relevance: "Relevance: Leadership",
  },
];

export default function DashboardTabs() {
  const [active, setActive] = useState("capacity");

  return (
    <div className="shell product-showcase reveal">
      <div className="showcase-copy" role="tablist" aria-label="Platform capabilities">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`showcase-tab${active === tab.id ? " active" : ""}`}
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
          >
            <span>{tab.number}</span>
            <div>
              <strong>{tab.title}</strong>
              <p>{tab.blurb}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="showcase-screen">
        <div className="screen-toolbar">
          <span>Aide Intelligence / Operations</span>
          <div>
            <i></i> Live customer environment
          </div>
        </div>

        <div className={`screen-panel${active === "capacity" ? " active" : ""}`}>
          <div className="screen-title">
            <div>
              <small>Capacity intelligence</small>
              <h3>Where organisational load is changing</h3>
            </div>
            <span>Last 30 days</span>
          </div>
          <div className="capacity-layout">
            <div className="bar-list">
              {capacityBars.map((bar) => (
                <div key={bar.label}>
                  <label>
                    {bar.label} <span>{bar.value}%</span>
                  </label>
                  <i>
                    <b
                      style={{ "--w": `${bar.value}%` } as React.CSSProperties}
                    ></b>
                  </i>
                </div>
              ))}
            </div>
            <div className="screen-insight">
              <small>Executive interpretation</small>
              <strong>Pressure is concentrated—not organisation-wide.</strong>
              <p>
                Review delivery capacity and meeting load before reallocating
                resources.
              </p>
              <span>Decision support only</span>
            </div>
          </div>
        </div>

        <div className={`screen-panel${active === "attention" ? " active" : ""}`}>
          <div className="screen-title">
            <div>
              <small>Attention queue</small>
              <h3>What materially changed this week</h3>
            </div>
            <span>Prioritised</span>
          </div>
          <div className="attention-list">
            {attentionItems.map((item) => (
              <article key={item.number}>
                <span>{item.number}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </div>
                <b>{item.status}</b>
              </article>
            ))}
          </div>
        </div>

        <div className={`screen-panel${active === "external" ? " active" : ""}`}>
          <div className="screen-title">
            <div>
              <small>External intelligence</small>
              <h3>Relevant context, filtered for leadership</h3>
            </div>
            <span>Today</span>
          </div>
          <div className="external-layout">
            <div className="external-feed">
              {externalFeed.map((item) => (
                <article key={item.kind}>
                  <i></i>
                  <div>
                    <small>{item.kind}</small>
                    <strong>{item.headline}</strong>
                    <span>{item.relevance}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="radar" aria-hidden="true">
              <i></i>
              <i></i>
              <i></i>
              <span></span>
              <b></b>
              <em></em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
