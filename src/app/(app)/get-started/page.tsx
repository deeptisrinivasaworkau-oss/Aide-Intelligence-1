import type { Metadata } from "next";
import AppHeader from "@/components/AppHeader";
import IntakeForm from "@/components/IntakeForm";

const description =
  "A quick intake so Aide Intelligence can tailor your dashboard to what you want tracked.";

export const metadata: Metadata = {
  title: "Get Started",
  description,
  openGraph: { title: "Get Started | Aide Intelligence", description },
};

export default function GetStartedPage() {
  return (
    <>
      <AppHeader />
      <div className="intake-wrap">
        <IntakeForm />
      </div>
    </>
  );
}
