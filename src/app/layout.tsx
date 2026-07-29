import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import { NO_FLASH_SCRIPT } from "@/components/ThemeToggle";
import "./globals.css";

// Display face. Nearly every AI product ships Inter everywhere; an editorial
// serif for headlines is what gives this one its own voice, and it suits a
// considered, executive tone better than another geometric sans.
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// UI face — actually loaded now. The old stylesheet named Inter but never
// fetched it, so everything silently fell back to the system font.
const ui = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aide Intelligence | Secure Executive and Workplace Intelligence",
    template: "%s | Aide Intelligence",
  },
  description:
    "Aide Intelligence securely transforms workplace activity, operational signals and relevant external information into a customer-controlled executive brief.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/aide-mark.png",
    apple: "/aide-mark.png",
  },
  openGraph: {
    type: "website",
    title: "Aide Intelligence | Secure Executive and Workplace Intelligence",
    description:
      "Aide Intelligence securely transforms workplace activity, operational signals and relevant external information into a customer-controlled executive brief.",
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
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${ui.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Sets data-theme before first paint so the page never flashes the
            wrong theme. Must run ahead of React, hence the inline script. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
