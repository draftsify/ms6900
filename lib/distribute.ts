import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getAccount,
  getMint,
} from "@solana/spl-token";
import {
  RPC_URL,
  TREASURY_SECRET_KEY,
  MS6900_MINT,
  STOCK_MINTS,
} from "./config";
import { alreadySent, addSent } from "./store";

export type Sent = { stock: string; amount: number; tx: string };

function treasury() {
  if (!TREASURY_SECRET_KEY) throw new Error("Treasury key not configured");
  return Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(TREASURY_SECRET_KEY) as number[]),
  );
}

const conn = () => new Connection(RPC_URL, "confirmed");

/** Raw balance of `mint` held by `owner`, 0 when the account does not exist. */
async function balanceOf(c: Connection, mint: PublicKey, owner: PublicKey) {
  try {
    const ata = await getAssociatedTokenAddress(mint, owner, true);
    const acc = await getAccount(c, ata);
    return acc.amount;
  } catch {
    return 0n;
  }
}

/**
 * What a wallet is owed for one stock:
 *
 *   treasury holding of that stock  ×  (wallet MS6900 / circulating MS6900)  ×  pct
 *
 * minus whatever has already gone out to that wallet for the same stock.
 */
export async function owed(
  c: Connection,
  wallet: PublicKey,
  stock: string,
  pct: number,
): Promise<bigint> {
  if (!MS6900_MINT) throw new Error("MS6900_MINT not configured");
  const stockMint = STOCK_MINTS[stock];
  if (!stockMint) throw new Error(`No mint configured for ${stock}`);

  const tre = treasury().publicKey;
  const ms = new PublicKey(MS6900_MINT);

  const [supplyInfo, held, pool] = await Promise.all([
    getMint(c, ms),
    balanceOf(c, ms, wallet),
    balanceOf(c, new PublicKey(stockMint), tre),
  ]);

  const circulating = supplyInfo.supply;
  if (circulating === 0n || held === 0n || pool === 0n) return 0n;

  // basis points keep the maths in integers
  const bps = BigInt(Math.round(pct * 100));
  const share = (pool * held * bps) / (circulating * 10_000n);

  const done = await alreadySent(wallet.toBase58(), stock);
  return share > done ? share - done : 0n;
}

/** Transfers one stock to a wallet and records it. Returns null when nothing is due. */
export async function sendStock(
  wallet: string,
  stock: string,
  pct: number,
): Promise<Sent | null> {
  const c = conn();
  const payer = treasury();
  const owner = new PublicKey(wallet);
  const mint = new PublicKey(STOCK_MINTS[stock]);

  const amount = await owed(c, owner, stock, pct);
  if (amount === 0n) return null;

  const info = await getMint(c, mint);
  const from = await getAssociatedTokenAddress(mint, payer.publicKey, true);
  const to = await getAssociatedTokenAddress(mint, owner, true);

  const tx = new Transaction();
  try {
    await getAccount(c, to);
  } catch {
    // the holder has never touched this token — the treasury opens the account
    tx.add(
      createAssociatedTokenAccountInstruction(payer.publicKey, to, owner, mint),
    );
  }
  tx.add(
    createTransferCheckedInstruction(
      from,
      mint,
      to,
      payer.publicKey,
      amount,
      info.decimals,
    ),
  );

  const sig = await sendAndConfirmTransaction(c, tx, [payer], {
    commitment: "confirmed",
  });
  await addSent(wallet, stock, amount);

  return {
    stock,
    amount: Number(amount) / 10 ** info.decimals,
    tx: sig,
  };
}
