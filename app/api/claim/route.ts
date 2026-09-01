import { NextResponse } from "next/server";
import { LISTINGS } from "@/app/components/Ticker";

const SOLANA = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const VALID = new Set(LISTINGS.map((l) => l.name));

type Slice = { stock: string; pct: number };

/**
 * Records a claim request.
 *
 * NOTE: nothing is persisted yet — no store is wired up. The route validates
 * the payload and returns a request id so the client flow is complete end to
 * end. Swap the body of `persist()` once the datastore is picked.
 */
async function persist(payload: { wallet: string; allocation: Slice[] }) {
  const id = `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  console.log("[claim]", id, payload.wallet, payload.allocation);
  return id;
}

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

  const total = allocation.reduce((s, a) => s + a.pct, 0);
  if (Math.abs(total - 100) > 0.5) {
    return NextResponse.json({ error: "Split must add up to 100%" }, { status: 400 });
  }

  const id = await persist({ wallet, allocation });
  return NextResponse.json({ ok: true, id });
}
