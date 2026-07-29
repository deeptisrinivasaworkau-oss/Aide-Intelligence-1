import * as Icon from "./dashboard/icons";

// The same marks the dashboard uses for its connectors, so the promise on the
// homepage and the thing you actually connect to stay in sync.
const INTEGRATIONS = [
  { label: "Google", node: <Icon.GoogleIcon /> },
  { label: "Gmail", node: <Icon.GmailIcon /> },
  { label: "Google Calendar", node: <Icon.GoogleCalendarIcon /> },
  { label: "Google Drive", node: <Icon.DriveIcon /> },
  { label: "Google Meet", node: <Icon.MeetIcon /> },
  { label: "Slack", node: <Icon.SlackIcon /> },
  { label: "Microsoft", node: <Icon.MicrosoftIcon /> },
  { label: "Outlook", node: <Icon.OutlookIcon /> },
  { label: "Outlook Calendar", node: <Icon.OutlookCalendarIcon /> },
  { label: "OneDrive", node: <Icon.OneDriveIcon /> },
  { label: "Microsoft Teams", node: <Icon.TeamsIcon /> },
];

export default function LogoMarquee() {
  return (
    <section className="marquee" aria-label="Systems Aide Intelligence connects to">
      <p className="marquee-label">Connects to the systems you already use</p>

      <div className="marquee-viewport">
        <div className="marquee-track">
          {/* Rendered twice so the second copy is already in place when the
              first scrolls out — that's what makes the loop seamless. The
              duplicate is hidden from screen readers. */}
          {[0, 1].map((copy) => (
            <ul className="marquee-row" key={copy} aria-hidden={copy === 1}>
              {INTEGRATIONS.map(({ label, node }) => (
                <li className="marquee-item" key={`${copy}-${label}`}>
                  <span className="marquee-icon">{node}</span>
                  <span className="marquee-name">{label}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
