import Link from "next/link";

export default function DashBar({ active }: { active: "claim" | "airdrops" }) {
  return (
    <header className="dash__bar">
      <Link className="dash__brand" href="/">
        <img src="/assets/logo.webp" alt="" width={28} height={28} />
        <span>MS6900</span>
      </Link>
      <nav className="dash__nav">
        <Link className={active === "airdrops" ? "is-on" : ""} href="/airdrops">
          Airdrops
        </Link>
        <Link className={active === "claim" ? "is-on" : ""} href="/claim">
          Claim
        </Link>
      </nav>
      <Link className="dash__back" href="/">
        Back to site
      </Link>
    </header>
  );
}
