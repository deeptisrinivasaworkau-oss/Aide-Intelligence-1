import type { Metadata } from "next";
import TryAideForm from "@/components/TryAideForm";

import "@/styles/try-aide.css";

const description =
  "Tell us what you want Aide Intelligence to surface, and we'll take it from there.";

export const metadata: Metadata = {
  title: "Try Aide",
  description,
  openGraph: { title: "Try Aide | Aide Intelligence", description },
};

export default function TryAidePage() {
  return (
    <section className="try-page">
      <div className="try-inner">
        <h1 className="try-headline">Know what matters, today.</h1>
        <TryAideForm />
      </div>
    </section>
  );
}
