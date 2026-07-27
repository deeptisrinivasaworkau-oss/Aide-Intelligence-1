import type { Metadata } from "next";
import Dashboard from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "A live, client-side view of your connected workplace tools. Nothing is stored.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <Dashboard />;
}
