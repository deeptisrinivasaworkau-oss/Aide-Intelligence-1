import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Aide Intelligence | Secure Executive and Workplace Intelligence",
    template: "%s | Aide Intelligence",
  },
  description:
    "Aide Intelligence securely transforms workplace activity, operational signals and relevant external information into customer-controlled Power BI insights.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/aide-mark.png",
    apple: "/aide-mark.png",
  },
  openGraph: {
    type: "website",
    title: "Aide Intelligence | Secure Executive and Workplace Intelligence",
    description:
      "Aide Intelligence securely transforms workplace activity, operational signals and relevant external information into customer-controlled Power BI insights.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
