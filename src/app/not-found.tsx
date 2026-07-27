import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested Aide Intelligence page could not be found.",
};

// Renders its own chrome: the root layout is bare so that /dashboard and
// /get-started can opt out of the marketing header and footer.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="thank-page">
          <div className="hero-aurora" aria-hidden="true"></div>
          <div className="shell thank-inner">
            <Image src="/aide-mark.png" alt="" width={240} height={230} />
            <p className="eyebrow">
              <span></span> Error 404
            </p>
            <h1>Page not found.</h1>
            <p>The page may have moved or the address may be incomplete.</p>
            <Link className="button" href="/">
              Return to Home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
