import { NextResponse } from "next/server";
import { LISTINGS } from "@/app/components/Ticker";
import { missingConfig } from "@/lib/config";
import {
  storeReady,
  saveClaim,
  lockWallet,
  unlockWallet,
  type ClaimRecord,
} from "@/lib/store";
import { sendStock, type Sent } from "@/lib/distribute";

export const runtime = "nodejs";
export const maxDuration = 60;

const SOLANA = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const VALID = new Set(LISTINGS.map((l) => l.name));

type Slice = { stock: string; pct: number };

const newId = () =>
  `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }

  const { wallet, allocation } = (body ?? {}) as {
    wallet?: string;
    allocation?: Slice[];
  };

  // ── validate ──────────────────────────────────────────────
  if (typeof wallet !== "string" || !SOLANA.test(wallet)) {
    return NextResponse.json({ error: "Invalid Solana address" }, { status: 400 });
  }
  if (!Array.isArray(allocation) || allocation.length === 0) {
    return NextResponse.json({ error: "Pick at least one stock" }, { status: 400 });
  }
  if (allocation.some((a) => !VALID.has(a.stock))) {
    return NextResponse.json({ error: "Unknown stock in allocation" }, { status: 400 });
  }
  if (new Set(allocation.map((a) => a.stock)).size !== allocation.length) {
    return NextResponse.json({ error: "Duplicate stock in allocation" }, { status: 400 });
  }
  if (allocation.some((a) => typeof a.pct !== "number" || a.pct < 0 || a.pct > 100)) {
    return NextResponse.json({ error: "Percentages must be 0–100" }, { status: 400 });
  }
  if (Math.abs(allocation.reduce((s, a) => s + a.pct, 0) - 100) > 0.5) {
    return NextResponse.json({ error: "Split must add up to 100%" }, { status: 400 });
  }

  // ── config gate: never claim to have sent what we cannot send ──
  const missing = missingConfig(allocation.map((a) => a.stock));
  if (missing.length) {
    return NextResponse.json(
      {
        error: "Distribution is not live yet",
        detail: `Waiting on: ${missing.join(", ")}`,
      },
      { status: 503 },
    );
  }

  // ── one claim at a time per wallet ────────────────────────
  if (!storeReady()) {
    return NextResponse.json({ error: "Store unavailable" }, { status: 503 });
  }
  if (!(await lockWallet(wallet))) {
    return NextResponse.json(
      { error: "A claim for this wallet is already running" },
      { status: 409 },
    );
  }

  const rec: ClaimRecord = {
    id: newId(),
    wallet,
    allocation,
    at: new Date().toISOString(),
    status: "recorded",
  };

  try {
    await saveClaim(rec);

    const sent: Sent[] = [];
    const failed: string[] = [];
    for (const a of allocation) {
      try {
        const s = await sendStock(wallet, a.stock, a.pct);
        if (s) sent.push(s);
      } catch (e) {
        failed.push(`${a.stock}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }

    rec.sent = sent;
    rec.status = failed.length ? (sent.length ? "partial" : "failed") : "sent";
    if (failed.length) rec.error = failed.join(" | ");
    await saveClaim(rec);

    if (!sent.length) {
      return NextResponse.json(
        {
          error: failed.length
            ? "Nothing could be sent"
            : "Nothing is owed to this wallet yet",
          detail: rec.error,
          id: rec.id,
        },
        { status: failed.length ? 502 : 200 },
      );
    }

    return NextResponse.json({ ok: true, id: rec.id, sent, partial: rec.status === "partial" });
  } finally {
    await unlockWallet(wallet);
  }
}
