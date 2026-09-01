
const COLS = [
  {
    title: "Protocol",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Stocks", href: "/#listings" },
      { label: "Claim", href: "/#claim" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot__inner">
        <div className="foot__top" data-reveal>
          <div className="foot__brand">
            <span className="foot__logo">
              <img src="/assets/logo.webp" alt="" width={30} height={30} />
              <b>MS6900</b>
            </span>
            <p>
              Real, listed equities acquired OTC and airdropped to token holders —
              settled onchain through pump.fun.
            </p>
          </div>

          <nav className="foot__cols">
            {COLS.map((c) => (
              <div key={c.title}>
                <h3>{c.title}</h3>
                {c.links.map((l) => (
                  <a key={l.label} href={l.href}>
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="foot__bot" data-reveal>
          <span>MS6900 &middot; v0.1.0</span>
          <span>Not investment advice</span>
          <span>&copy; 2026</span>
        </div>
      </div>
    </footer>
  );
}
