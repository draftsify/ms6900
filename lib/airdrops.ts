export type Airdrop = {
  epoch: number;
  date: string; // ISO
  stock: string; // must match a LISTINGS name
  shares: number;
  wallets: number;
  tx: string; // Solana signature
};

/**
 * No distribution has settled yet, so the live list is empty.
 * `SAMPLE` exists purely to show the page layout and is rendered behind a
 * visible "sample data" notice — never present it as a real proof.
 * Drop real rows into AIRDROPS (or point this at the datastore) at launch.
 */
export const AIRDROPS: Airdrop[] = [];

export const SAMPLE: Airdrop[] = [
  { epoch: 4, date: "2026-08-31", stock: "NVDAx", shares: 12.4081, wallets: 1846, tx: "5Qk8fZr2xVnT9wLpJ4hCmB3yD6sGaE1uNXtRvKcHqPzM7bYfWjS2dAo" },
  { epoch: 4, date: "2026-08-31", stock: "OpenAI", shares: 3.2054, wallets: 1846, tx: "3TnHb7VqZm1cRxJ8dLyP2wKfE5gA9uSoQ4iNXtCvBhMzD6rYkW1eFpU" },
  { epoch: 3, date: "2026-08-30", stock: "Apple", shares: 44.9017, wallets: 1792, tx: "8LmRc4XvKp6qWzB2fN9tYdA5hJ3gEuS1oQiCbHxMZrD7yPkV0nTwFje" },
  { epoch: 3, date: "2026-08-30", stock: "SPCXx", shares: 6.1130, wallets: 1792, tx: "2WpKd9ZqRm5xTvC7bJ4nY8hL1gF6aUeS3oQiXtNBcHzMD0yrPkVwGuA" },
  { epoch: 2, date: "2026-08-29", stock: "Anduril", shares: 9.7742, wallets: 1701, tx: "7HxNb3VmZq8cKpR1dLyT5wJfE2gA4uSoP6iCXtMvBhZzD9rYkW0eFqL" },
  { epoch: 1, date: "2026-08-28", stock: "MSFTx", shares: 21.3388, wallets: 1544, tx: "4RkVc8XqZp2mWzT6fB9nY3hJ7gE5aUdS1oQiCbHxMLrD0yPkN9twFje" },
];

export const fmtShares = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });

export const fmtDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export const shortTx = (tx: string) => `${tx.slice(0, 6)}…${tx.slice(-6)}`;
