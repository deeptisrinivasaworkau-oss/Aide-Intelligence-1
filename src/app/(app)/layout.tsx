import "@/styles/app-shell.css";

// The app pages (get-started, dashboard) deliberately skip the marketing
// header and footer — they carry their own compact chrome.
export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main id="main">{children}</main>;
}
