"use client";

import * as Icon from "./icons";

export type View = "summary" | "google" | "microsoft" | "slack";

const TABS: { id: View; label: string; icon?: React.ReactNode }[] = [
  { id: "summary", label: "Summary" },
  { id: "google", label: "Google", icon: <Icon.GoogleIcon /> },
  { id: "microsoft", label: "Microsoft", icon: <Icon.MicrosoftIcon /> },
  { id: "slack", label: "Slack", icon: <Icon.SlackIcon /> },
];

/** Parent-company switcher. Sub-brands live inside each view, one level down. */
export default function ViewTabs({
  view,
  onChange,
  connected,
}: {
  view: View;
  onChange: (v: View) => void;
  connected: Record<Exclude<View, "summary">, boolean>;
}) {
  return (
    <div className="view-tabs" role="tablist" aria-label="Data sources">
      {TABS.map((tab) => {
        const isActive = view === tab.id;
        const isOn = tab.id !== "summary" && connected[tab.id];
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            className={`view-tab${isActive ? " active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span className="view-tab-icon">{tab.icon}</span>}
            <span>{tab.label}</span>
            {isOn && <span className="view-tab-dot" aria-label="connected" />}
          </button>
        );
      })}
    </div>
  );
}
