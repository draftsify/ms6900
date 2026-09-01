"use client";

import { useMemo, useState } from "react";
import { LISTINGS } from "./Ticker";
import DashBar from "./DashBar";

const SOLANA = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

type Status = { kind: "idle" | "sending" | "done" | "error"; msg?: string };

export default function ClaimPanel({ embedded = false }: { embedded?: boolean }) {
  const [wallet, setWallet] = useState("");
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [dragging, setDragging] = useState<string | null>(null);

  const names = LISTINGS.map((l) => l.name);
  const selected = names.filter((n) => n in picked);
  const total = selected.reduce((s, n) => s + (picked[n] || 0), 0);

  const walletOk = SOLANA.test(wallet.trim());
  const totalOk = Math.round(total) === 100;
  const canClaim = walletOk && selected.length > 0 && totalOk && status.kind !== "sending";

  const evenSplit = (list: string[]) => {
    const next: Record<string, number> = {};
    if (!list.length) return next;
    const base = Math.floor((100 / list.length) * 10) / 10;
    list.forEach((n) => (next[n] = base));
    // push the rounding remainder onto the first entry
    const drift = Math.round((100 - base * list.length) * 10) / 10;
    next[list[0]] = Math.round((base + drift) * 10) / 10;
    return next;
  };

  const toggle = (name: string) => {
    const next = { ...picked };
    if (name in next) delete next[name];
    else next[name] = 0;
    setPicked(evenSplit(Object.keys(next)));
    setStatus({ kind: "idle" });
  };

  const setPct = (name: string, v: number) => {
    setPicked((p) => ({ ...p, [name]: Math.max(0, Math.min(100, v)) }));
    setStatus({ kind: "idle" });
  };

  const allOn = selected.length === names.length;
  const toggleAll = () => setPicked(allOn ? {} : evenSplit(names));

  const logoOf = useMemo(
    () => Object.fromEntries(LISTINGS.map((l) => [l.name, l.logo])),
    [],
  );

  async function submit() {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          wallet: wallet.trim(),
          allocation: selected.map((n) => ({ stock: n, pct: picked[n] })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setStatus({ kind: "done", msg: data.id });
    } catch (e) {
      setStatus({ kind: "error", msg: e instanceof Error ? e.message : "Failed" });
    }
  }

  return (
    <div className={embedded ? "dash dash--embed" : "dash"} id="claim">
      {!embedded && <DashBar active="claim" />}

      <main className="dash__main">
        <div className="dash__head" data-reveal>
          {embedded ? <h2>Claim your allocation</h2> : <h1>Claim your allocation</h1>}
          <p>
            Paste the wallet holding MS6900, pick the stocks you want, and set how
            your share is split between them.
          </p>
        </div>

        {/* ── wallet ── */}
        <section className="panel" data-reveal>
          <div className="panel__head">
            <span className="panel__step">01</span>
            <h2>Wallet</h2>
          </div>
          <div className="field">
            <input
              value={wallet}
              onChange={(e) => {
                setWallet(e.target.value);
                setStatus({ kind: "idle" });
              }}
              placeholder="Paste your Solana address"
              spellCheck={false}
              autoComplete="off"
              aria-label="Solana wallet address"
            />
            {wallet && (
              <span className={`field__flag ${walletOk ? "is-ok" : "is-bad"}`}>
                {walletOk ? "Valid" : "Invalid address"}
              </span>
            )}
          </div>
        </section>

        {/* ── stocks ── */}
        <section className="panel" data-reveal>
          <div className="panel__head">
            <span className="panel__step">02</span>
            <h2>Stocks</h2>
            <button className="ghost" onClick={toggleAll} type="button">
              {allOn ? "Clear all" : "Select all"}
            </button>
            <button
              className="ghost"
              onClick={() => setPicked(evenSplit(selected))}
              type="button"
              disabled={!selected.length}
            >
              Split evenly
            </button>
          </div>

          <ul className="picks">
            {names.map((n) => {
              const on = n in picked;
              return (
                <li key={n} className={`pick ${on ? "is-on" : ""}`}>
                  <button
                    className="pick__hit"
                    onClick={() => toggle(n)}
                    type="button"
                    aria-pressed={on}
                  >
                    <span className="pick__box" aria-hidden>
                      <svg viewBox="0 0 16 16">
                        <path d="M3.4 8.4 6.5 11.5 12.6 4.8" />
                      </svg>
                    </span>
                    <img
                      className="pick__logo"
                      src={`/assets/logos/${logoOf[n]}`}
                      alt=""
                      width={22}
                      height={22}
                    />
                    <span className="pick__name">{n}</span>
                  </button>

                  <div className="pick__pct" aria-hidden={!on}>
                    <div
                      className={`slider ${dragging === n ? "is-drag" : ""}`}
                      style={
                        { "--v": `${on ? picked[n] : 0}%` } as React.CSSProperties
                      }
                    >
                      <span className="slider__track" aria-hidden />
                      <span className="slider__fill" aria-hidden />
                      <span className="slider__dot" aria-hidden />
                      <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.5}
                        value={on ? picked[n] : 0}
                        disabled={!on}
                        onPointerDown={() => setDragging(n)}
                        onPointerUp={() => setDragging(null)}
                        onBlur={() => setDragging(null)}
                        onChange={(e) => setPct(n, Number(e.target.value))}
                        aria-label={`${n} percentage`}
                      />
                    </div>
                    <div className="pct">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={on ? picked[n] : 0}
                        disabled={!on}
                        onChange={(e) => setPct(n, Number(e.target.value))}
                        aria-label={`${n} percentage value`}
                      />
                      <span>%</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── summary ── */}
        <section className="summary" data-reveal>
          <div className="summary__row">
            <span>Selected</span>
            <b>
              {selected.length} / {names.length}
            </b>
          </div>
          <div className="summary__row">
            <span>Total split</span>
            <b className={totalOk ? "is-ok" : "is-bad"}>
              {Math.round(total * 10) / 10}%
            </b>
          </div>
          <div className="bar" aria-hidden>
            <i style={{ width: `${Math.min(100, total)}%` }} />
          </div>

          <button className="claim" onClick={submit} disabled={!canClaim} type="button">
            {status.kind === "sending" ? "Submitting…" : "Claim"}
          </button>

          {status.kind === "done" && (
            <p className="note is-ok">
              Queued — request <code>{status.msg}</code>. Distribution settles at the
              next snapshot.
            </p>
          )}
          {status.kind === "error" && <p className="note is-bad">{status.msg}</p>}
          {status.kind === "idle" && !canClaim && (
            <p className="note">
              {!walletOk
                ? "Enter a valid Solana address to continue."
                : !selected.length
                  ? "Pick at least one stock."
                  : "The split has to add up to 100%."}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
