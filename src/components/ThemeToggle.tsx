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

/** Subscribes to the attribute itself, so the button can't drift out of sync. */
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

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage unavailable — the theme still applies for this page view.
    }
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.6v2.6M12 18.8v2.6M4.4 12H1.8M22.2 12h-2.6M6.3 6.3 4.5 4.5M19.5 19.5l-1.8-1.8M17.7 6.3l1.8-1.8M4.5 19.5l1.8-1.8" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7z" />
        </svg>
      )}
    </button>
  );
}
