"use client";

import { useSyncExternalStore } from "react";

export const THEME_KEY = "aide-theme";
export type Theme = "light" | "dark";

/**
 * Runs before first paint (see layout.tsx) so the page never renders in one
 * theme and snaps to the other. Kept as a string because it has to be inlined
 * into the document head, ahead of React.
 */
export const NO_FLASH_SCRIPT = `
(function(){try{
  var s=localStorage.getItem('${THEME_KEY}');
  var t=s||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  document.documentElement.setAttribute('data-theme',t);
}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();
`;

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

/** Subscribes to the attribute itself, so the switch can't drift out of sync. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, currentTheme, () => "dark" as Theme);
  const isLight = theme === "light";

  const toggle = () => {
    const next: Theme = isLight ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage unavailable — the theme still applies for this page view.
    }
  };

  return (
    <button
      className="theme-switch"
      type="button"
      role="switch"
      aria-checked={isLight}
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {/* Both glyphs sit in the track; the knob slides to the active side. */}
      <span className="theme-switch-glyph theme-switch-sun" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4.6" />
          <path d="M12 1.4v3M12 19.6v3M1.4 12h3M19.6 12h3M4.4 4.4l2.1 2.1M17.5 17.5l2.1 2.1M19.6 4.4l-2.1 2.1M6.5 17.5l-2.1 2.1" />
        </svg>
      </span>
      <span className="theme-switch-glyph theme-switch-moon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z" />
        </svg>
      </span>
      <span className="theme-switch-knob" aria-hidden="true" />
    </button>
  );
}
