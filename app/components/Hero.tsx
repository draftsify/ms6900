"use client";

import { useEffect, useRef } from "react";

const NAV = [
  { label: "Home", href: "#hero" },
  { label: "Airdrops", href: "/airdrops" },
  { label: "Claim", href: "#claim" },
];

const SUB =
  "MS6900 buys real, listed equities OTC and airdrops them to token holders — every distribution settled onchain through pump.fun.";

export default function Hero({ children }: { children?: React.ReactNode }) {
  const subRef = useRef<HTMLParagraphElement>(null);

  // word-by-word blur reveal on the supporting text
  useEffect(() => {
    const el = subRef.current;
    if (!el) return;
    el.innerHTML = SUB.split(" ")
      .map(
        (w, i) =>
          `<span class="w" style="transition-delay:${40 + i * 26}ms">${w}</span>`,
      )
      .join(" ");
    requestAnimationFrame(() => el.classList.add("in"));
  }, []);

  return (
    <>

      <nav className="nav">
        <a className="nav__logo" href="#hero">
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

      <section className="hero" id="hero">
        <div className="hero__photo" aria-hidden />
        <div className="visual" aria-hidden>
          <div className="visual__wash" />
          <div className="visual__core" />
        </div>

        <div className="hero__inner">
          <span className="pill anim">Real Equity Distribution</span>

          <h1 className="hero__title anim">
            The tokenized stock distribution layer
          </h1>

          <p className="hero__sub" ref={subRef}>
            {SUB}
          </p>
        </div>

        {children}
      </section>
    </>
  );
}
