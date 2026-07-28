import Image from "next/image";
import Link from "next/link";
import SignOutLink from "./SignOutLink";

export default function AppHeader() {
  return (
    <header className="app-header">
      <Link className="app-brand" href="/">
        <Image src="/aide-mark.png" alt="" width={240} height={230} />
        <span>Aide Intelligence</span>
      </Link>
      <div className="app-header-actions">
        <SignOutLink />
        <Link className="app-back" href="/">
          &larr; Back to site
        </Link>
      </div>
    </header>
  );
}
