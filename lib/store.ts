import { REDIS_URL, REDIS_TOKEN } from "./config";

/**
 * Thin Upstash Redis REST client — no SDK, just fetch.
 * Every claim is written here: the request itself, and the running total each
 * wallet has already been sent per stock (so nothing can be claimed twice).
 */
async function cmd<T = unknown>(...args: (string | number)[]): Promise<T> {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error("Store not configured");
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${REDIS_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(args.map(String)),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Store error ${res.status}`);
  const json = (await res.json()) as { result: T; error?: string };
  if (json.error) throw new Error(json.error);
  return json.result;
}

export const storeReady = () => Boolean(REDIS_URL && REDIS_TOKEN);

export type ClaimRecord = {
  id: string;
  wallet: string;
  allocation: { stock: string; pct: number }[];
  at: string;
  status: "recorded" | "sent" | "partial" | "failed";
  sent?: { stock: string; amount: number; tx: string }[];
  error?: string;
};

export async function saveClaim(rec: ClaimRecord) {
  await cmd("SET", `claim:${rec.id}`, JSON.stringify(rec));
  await cmd("LPUSH", "claims", rec.id);
  await cmd("LPUSH", `claims:${rec.wallet}`, rec.id);
}

export async function getClaim(id: string) {
  const raw = await cmd<string | null>("GET", `claim:${id}`);
  return raw ? (JSON.parse(raw) as ClaimRecord) : null;
}

/** Raw token units already sent to a wallet for one stock. */
export async function alreadySent(wallet: string, stock: string) {
  const v = await cmd<string | null>("GET", `sent:${wallet}:${stock}`);
  return v ? BigInt(v) : 0n;
}

export async function addSent(wallet: string, stock: string, amount: bigint) {
  const prev = await alreadySent(wallet, stock);
  await cmd("SET", `sent:${wallet}:${stock}`, (prev + amount).toString());
}

/** One claim in flight per wallet — guards against a double submit. */
export async function lockWallet(wallet: string, ttlSeconds = 120) {
  const ok = await cmd<number | string>(
    "SET",
    `lock:${wallet}`,
    "1",
    "NX",
    "EX",
    ttlSeconds,
  );
  return ok === "OK" || ok === 1;
}

export async function unlockWallet(wallet: string) {
  await cmd("DEL", `lock:${wallet}`);
}

export async function recentClaims(n = 50) {
  const ids = await cmd<string[]>("LRANGE", "claims", 0, n - 1);
  if (!ids?.length) return [];
  const rows = await Promise.all(ids.map((id) => getClaim(id)));
  return rows.filter((r): r is ClaimRecord => Boolean(r));
}
