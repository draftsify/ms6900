import type { Metadata } from "next";
import DashBar from "../components/DashBar";
import { LISTINGS } from "../components/Ticker";
import {
  AIRDROPS,
  SAMPLE,
  fmtShares,
  fmtDate,
  shortTx,
  type Airdrop,
} from "@/lib/airdrops";

export const metadata: Metadata = {
  title: "Airdrop proofs — MS6900",
  description:
    "Every MS6900 distribution, with the shares acquired and the transaction that settled them.",
};

const logoOf = Object.fromEntries(LISTINGS.map((l) => [l.name, l.logo]));

function Row({ a }: { a: Airdrop }) {
  return (
    <li className="drop" data-reveal>
      <div className="drop__epoch">
        <b>Epoch {String(a.epoch).padStart(3, "0")}</b>
        <i>{fmtDate(a.date)}</i>
      </div>
      <div className="drop__stock">
        <img src={`/assets/logos/${logoOf[a.stock]}`} alt="" width={22} height={22} />
        <span>{a.stock}</span>
      </div>
      <div className="drop__num">
        <i>Shares</i>
        <b>{fmtShares(a.shares)}</b>
      </div>
      <div className="drop__num">
        <i>Wallets</i>
        <b>{a.wallets.toLocaleString("en-US")}</b>
      </div>
      <a
        className="drop__tx"
        href={`https://solscan.io/tx/${a.tx}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <code>{shortTx(a.tx)}</code>
        <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden>
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"
          />
        </svg>
      </a>
    </li>
  );
}

export default function AirdropsPage() {
  const live = AIRDROPS.length > 0;
  const rows = live ? AIRDROPS : SAMPLE;

  const totalShares = rows.reduce((s, a) => s + a.shares, 0);
  const epochs = new Set(rows.map((a) => a.epoch)).size;
  const wallets = Math.max(...rows.map((a) => a.wallets), 0);

  return (
    <div className="dash">
      <DashBar active="airdrops" />

      <main className="dash__main dash__main--wide">
        <div className="dash__head" data-reveal>
          <h1>Airdrop proofs</h1>
          <p>
            Every distribution MS6900 has settled — the shares acquired, the wallets
            paid, and the transaction that moved them.
          </p>
        </div>

        {!live && (
          <div className="notice" data-reveal>
            <span className="notice__dot" aria-hidden />
            <p>
              <b>Sample data.</b> No distribution has settled yet — these rows show the
              layout only and the signatures are not real transactions. The first epoch
              publishes here.
            </p>
          </div>
        )}

        <div className="kpis" data-reveal>
          <div className="kpi">
            <i>Epochs settled</i>
            <b>{live ? epochs : "—"}</b>
          </div>
          <div className="kpi">
            <i>Shares distributed</i>
            <b>{live ? fmtShares(totalShares) : "—"}</b>
          </div>
          <div className="kpi">
            <i>Wallets paid</i>
            <b>{live ? wallets.toLocaleString("en-US") : "—"}</b>
          </div>
          <div className="kpi">
            <i>Treasury retained</i>
            <b>0%</b>
          </div>
        </div>

        <ul className={`drops ${live ? "" : "is-sample"}`}>
          {rows.map((a) => (
            <Row key={`${a.epoch}-${a.stock}`} a={a} />
          ))}
        </ul>
      </main>
    </div>
  );
}
