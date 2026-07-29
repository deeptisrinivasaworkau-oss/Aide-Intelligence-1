"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

// Security, Integrations, Use Cases and About stay live and stay in the
// footer — the top nav is deliberately down to two destinations.
const navLinks = [
  { href: "/platform", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  // Enters the same gated path as the old Netlify build: login -> intake -> dashboard.
  { href: "/dashboard", label: "My Dashboard" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The homepage hero sits behind the header, so it starts transparent there
  // and frosts once scrolled. Every other page frosts immediately.
  const overHero = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header${scrolled || !overHero ? " scrolled" : ""}${overHero ? " over-hero" : ""}`}
    >
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Aide Intelligence home">
          <Image
            className="brand-mark"
            src="/aide-mark.png"
            alt=""
            width={240}
            height={230}
            priority
          />
          <span className="brand-word">Aide Intelligence</span>
        </Link>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="primary-nav"
          className={`nav${open ? " open" : ""}`}
          aria-label="Primary navigation"
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}

          <span className="nav-actions">
            <ThemeToggle />
            <Link
              className="nav-btn nav-btn-quiet"
              href="/login"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
            <Link
              className="nav-btn nav-btn-solid"
              href="/try-aide"
              onClick={() => setOpen(false)}
            >
              Try Aide
            </Link>
          </span>
        </nav>
      </div>
    </header>
  );
}
