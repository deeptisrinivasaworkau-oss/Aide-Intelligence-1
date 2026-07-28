"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Platform, Security, Integrations and Use Cases still exist and are still
// linked from the footer — they're out of the top nav to keep it minimal.
const navLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Demonstration" },
  { href: "/login", label: "Sign In" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // The homepage hero sits behind the header, so it starts transparent there
  // and only frosts once you scroll past it. Every other page frosts at once.
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
            src="/aide-logo.png"
            alt="Aide Intelligence"
            width={1300}
            height={260}
            priority
          />
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
        </nav>
      </div>
    </header>
  );
}
