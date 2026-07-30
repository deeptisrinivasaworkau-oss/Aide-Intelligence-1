"use client";

/** One sub-brand under a parent company: mark, name, state, connect action. */
export default function SourceRow({
  icon,
  name,
  note,
  connected,
  disabled,
  soon,
  onConnect,
}: {
  icon: React.ReactNode;
  name: string;
  note?: string;
  connected?: boolean;
  disabled?: boolean;
  soon?: boolean;
  onConnect?: () => void;
}) {
  return (
    <div className={`source-row${soon ? " soon" : ""}`}>
      <span className="source-mark">{icon}</span>
      <span className="source-text">
        <span className="source-name">{name}</span>
        {note && <span className="source-note">{note}</span>}
      </span>
      {soon ? (
        <span className="source-soon">Coming soon</span>
      ) : (
        <button
          className={`source-btn${connected ? " connected" : ""}`}
          type="button"
          disabled={disabled}
          onClick={onConnect}
        >
          {connected ? "Connected" : "Connect"}
        </button>
      )}
    </div>
  );
}
