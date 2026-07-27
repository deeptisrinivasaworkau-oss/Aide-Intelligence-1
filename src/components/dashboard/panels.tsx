import { initials, timeAgo } from "@/lib/dashboard/format";
import type {
  EventItem,
  FileItem,
  MailItem,
  PanelState,
  SlackItem,
} from "@/lib/dashboard/types";

type PanelProps<T> = {
  title: string;
  state: PanelState<T>;
  lockedHint: string;
  loadingLabel: string;
  emptyLabel: string;
  children: (items: T[]) => React.ReactNode;
};

export function Panel<T>({
  title,
  state,
  lockedHint,
  loadingLabel,
  emptyLabel,
  children,
}: PanelProps<T>) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        <div className="meta">{state.meta}</div>
      </div>
      {state.status === "locked" && <div className="locked">{lockedHint}</div>}
      {state.status === "loading" && (
        <div className="spinner">Pulling {loadingLabel}…</div>
      )}
      {state.status === "error" && <div className="error">{state.error}</div>}
      {state.status === "ready" &&
        (state.items.length === 0 ? (
          <div className="empty">{emptyLabel}</div>
        ) : (
          children(state.items)
        ))}
    </div>
  );
}

export function MailRows({ items }: { items: MailItem[] }) {
  return (
    <>
      {items.map((item) => (
        <a
          className="row"
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="avatar">{initials(item.sender)}</div>
          <div className="content">
            <div className="top-line">
              <span className="sender">{item.sender}</span>
              <span className="date">{timeAgo(item.date)}</span>
            </div>
            <div className="subject">
              {item.subject}
              {item.unread && <span className="badge unread">unread</span>}
              {item.important && <span className="badge important">important</span>}
            </div>
            <div className="summary">{item.summaryLine}</div>
            {item.verdict && <div className="verdict">→ {item.verdict}</div>}
          </div>
        </a>
      ))}
    </>
  );
}

export function FileRows({ items }: { items: FileItem[] }) {
  return (
    <>
      {items.map((item) => (
        <a
          className="row"
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="filetype">{item.type}</div>
          <div className="content">
            <div className="top-line">
              <span className="sender">{item.name}</span>
              <span className="date">{timeAgo(item.modified)}</span>
            </div>
            <div className="snippet owner-tag">{item.owner}</div>
          </div>
        </a>
      ))}
    </>
  );
}

export function EventRows({ items }: { items: EventItem[] }) {
  return (
    <>
      {items.map((item) => (
        <a
          className="row"
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="filetype">CAL</div>
          <div className="content">
            <div className="top-line">
              <span className="sender">{item.title}</span>
              <span className="date">
                {item.start ? new Date(item.start).toLocaleString() : ""}
              </span>
            </div>
            <div className="snippet">{item.location}</div>
          </div>
        </a>
      ))}
    </>
  );
}

export function SlackRows({
  items,
  teamId,
}: {
  items: SlackItem[];
  teamId: string;
}) {
  return (
    <>
      {items.map((item) => (
        <a
          className="row"
          key={item.channelId}
          href={`https://app.slack.com/client/${teamId}/${item.channelId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="avatar">#</div>
          <div className="content">
            <div className="top-line">
              <span className="sender">#{item.channelName}</span>
              <span className="date">
                {timeAgo(new Date(Number(item.ts) * 1000).toISOString())}
              </span>
            </div>
            <div className="snippet">{item.text}</div>
          </div>
        </a>
      ))}
    </>
  );
}
