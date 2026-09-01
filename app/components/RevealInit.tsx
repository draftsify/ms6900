"use client";

import { useEffect } from "react";

/**
 * Fades + un-blurs every [data-reveal] block as it scrolls into view.
 * Elements are staggered by their position among their siblings.
 */
export default function RevealInit() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!nodes.length) return;

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    nodes.forEach((n) => {
      const siblings = n.parentElement
        ? Array.from(n.parentElement.children).filter((c) =>
            c.hasAttribute("data-reveal"),
          )
        : [];
      const i = Math.max(0, siblings.indexOf(n));
      n.style.transitionDelay = `${Math.min(i, 6) * 70}ms`;
      io.observe(n);
    });

    // safety net: never leave content hidden if the observer misfires
    const t = setTimeout(() => nodes.forEach((n) => n.classList.add("in")), 2500);

    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return null;
}
