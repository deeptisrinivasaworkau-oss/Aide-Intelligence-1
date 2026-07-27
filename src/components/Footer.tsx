import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-main">
        <div className="footer-brand-block">
          <Link className="brand footer-brand" href="/">
            <Image
              src="/aide-logo.png"
              alt="Aide Intelligence"
              width={1300}
              height={260}
            />
          </Link>
          <p>
            Secure operational intelligence for leaders who require clarity
            without surrendering control.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h2>Product</h2>
            <Link href="/platform">Platform</Link>
            <Link href="/security">Security</Link>
            <Link href="/integrations">Integrations</Link>
            <Link href="/use-cases">Use Cases</Link>
          </div>
          <div>
            <h2>Company</h2>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <a href="#" aria-label="Aide Intelligence on LinkedIn — placeholder">
              LinkedIn
            </a>
          </div>
          <div>
            <h2>Legal</h2>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>
          Aide Intelligence provides decision-support information. Organisational
          and employment decisions should remain subject to appropriate human
          review.
        </p>
        <p>© {new Date().getFullYear()} Aide Intelligence.</p>
      </div>
    </footer>
  );
}
