/** Everything the distribution needs, read once from the environment. */

export const RPC_URL =
  process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";

/** 64-byte secret key, as the JSON array printed by `solana-keygen`. */
export const TREASURY_SECRET_KEY = process.env.TREASURY_SECRET_KEY;

/** The MS6900 SPL mint. Holdings of this decide the pro-rata share. */
export const MS6900_MINT = process.env.MS6900_MINT;

export const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
export const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * Stock name (must match a LISTINGS entry) -> SPL mint of the tokenized share.
 * Fill these in as each one is sourced; a stock with no mint here simply
 * cannot be claimed yet and the API says so rather than pretending.
 *
 * Set STOCK_MINTS as JSON, e.g. {"NVDAx":"<mint>","Apple":"<mint>"}
 */
export const STOCK_MINTS: Record<string, string> = (() => {
  try {
    return JSON.parse(process.env.STOCK_MINTS ?? "{}");
  } catch {
    return {};
  }
})();

export type Missing = string[];

/** What still has to be configured before a claim can actually send. */
export function missingConfig(stocks: string[]): Missing {
  const missing: Missing = [];
  if (!TREASURY_SECRET_KEY) missing.push("TREASURY_SECRET_KEY");
  if (!MS6900_MINT) missing.push("MS6900_MINT");
  if (!REDIS_URL || !REDIS_TOKEN) missing.push("UPSTASH_REDIS_REST_URL/TOKEN");
  const noMint = stocks.filter((s) => !STOCK_MINTS[s]);
  if (noMint.length) missing.push(`STOCK_MINTS for ${noMint.join(", ")}`);
  return missing;
}
