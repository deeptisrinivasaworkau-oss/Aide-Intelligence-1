import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const description =
  "Your Aide Intelligence demonstration request has been received.";

export const metadata: Metadata = {
  title: "Request Received",
  description,
  openGraph: { title: "Request Received | Aide Intelligence", description },
};

export default function ThankYouPage() {
  return (
    <section className="thank-page">
      <div className="hero-aurora" aria-hidden="true"></div>
      <div className="shell thank-inner">
        <Image src="/aide-mark.png" alt="" width={240} height={230} />
        <p className="eyebrow">
          <span></span> Request received
        </p>
        <h1>Thank you.</h1>
        <p>
          Your demonstration request has been submitted. A member of the Aide
          Intelligence team can now follow up using the details provided.
        </p>
        <Link className="button" href="/">
          Return to Home
        </Link>
      </div>
    </section>
  );
}
