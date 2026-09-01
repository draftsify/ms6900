import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "How it works — MS6900",
  description:
    "Fees buy real tokenized shares, your MS6900 balance decides your slice, and the claim sends it straight to your wallet.",
};

const STEPS = [
  {
    n: "01",
    title: "Fees land in the treasury",
    body: "Creator fees from the pump.fun market accrue to a single treasury wallet. That wallet is the only source of funds for every distribution — nothing else feeds it.",
  },
  {
    n: "02",
    title: "The treasury buys the shares",
    body: "Those fees are spent on tokenized equities acquired OTC. Each position is a real tokenized share sitting in the treasury wallet, not a synthetic or an IOU.",
  },
  {
    n: "03",
    title: "Your balance is read from the chain",
    body: "Nothing to register, no allowlist, no form. Your MS6900 balance is read directly from Solana at the moment you claim.",
  },
  {
    n: "04",
    title: "Your slice is computed",
    body: "Treasury holding of that stock × (your MS6900 ÷ circulating supply) × the percentage you set for it. Whatever has already been sent to you is subtracted, so nothing can be drawn twice.",
  },
  {
    n: "05",
    title: "You choose",
    body: "Paste your wallet, tick the stocks you want, and move the sliders until the split adds up to 100%. You can put everything on one name or spread it across all of them.",
  },
  {
    n: "06",
    title: "It sends, immediately",
    body: "The transfer leaves the treasury the moment you claim — straight to the wallet you pasted. If you have never held that token, the treasury opens the account for you and pays the rent.",
  },
];

const NOTES = [
  ["Treasury retained", "0% — every share the fees buy leaves the treasury."],
  ["Distribution", "Direct transfer. No claim window, no vesting, no lockup."],
  ["Double claims", "Impossible — each wallet's sent total is recorded per stock."],
  ["What you hold", "Tokenized shares give economic exposure. They carry no voting, dividend or ownership rights in the underlying company."],
];

export default function HowItWorks() {
  return (
    <div className="dash">
      <header className="dash__bar">
        <Link className="dash__brand" href="/">
          <img src="/assets/logo.webp" alt="" width={28} height={28} />
          <span>MS6900</span>
        </Link>
        <Link className="dash__back" href="/">
          Back to site
        </Link>
      </header>

      <main className="dash__main">
        <div className="dash__head" data-reveal>
          <h1>How it works</h1>
          <p>
            MS6900 turns the fees its own market generates into real tokenized
            shares, then hands them to the people holding the token. Six steps,
            start to finish.
          </p>
        </div>

        <ol className="steps">
          {STEPS.map((s) => (
            <li className="step" key={s.n} data-reveal>
              <span className="step__n">{s.n}</span>
              <div className="step__body">
                <h2>{s.title}</h2>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="notes" data-reveal>
          <h2 className="notes__title">Good to know</h2>
          <dl>
            {NOTES.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="cta-line" data-reveal>
          <p>Ready when you are.</p>
          <Link className="btn btn--light" href="/">
            Claim your allocation
            <span className="btn__arrow" aria-hidden>
              <svg viewBox="0 0 256 256" width="14" height="14">
                <path
                  fill="currentColor"
                  d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"
                />
              </svg>
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
