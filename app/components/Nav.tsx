const NAV = [{ label: "How it works", href: "/how-it-works" }];

export default function Nav() {
  return (
    <nav className="nav">
      <a className="nav__logo" href="/">
        <img
          className="nav__mark"
          src="/assets/logo.webp"
          alt=""
          width={30}
          height={30}
        />
        <span>MS6900</span>
      </a>
      <div className="nav__links">
        {NAV.map((n) => (
          <a key={n.label} href={n.href}>
            {n.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
