// ========================================
// Solana helpers: balance reads & transfers
// Uses @solana/web3.js v1 + @solana/spl-token
// ========================================

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { SOLANA_NATIVE, SOLANA_CHAIN_ID, CHAINS, type TokenConfig } from './tokens';

// Solana platform wallet (set in .env.local as NEXT_PUBLIC_PLATFORM_WALLET_SOL)
export function getSolanaPlatformWallet(): string {
  const wallet = process.env.NEXT_PUBLIC_PLATFORM_WALLET_SOL;
  if (!wallet) {
    throw new Error('Solana platform wallet not configured. Set NEXT_PUBLIC_PLATFORM_WALLET_SOL in .env.local');
  }
  return wallet;
}

// RPC endpoints with fallback
const SOLANA_RPC_URLS = [
  CHAINS[SOLANA_CHAIN_ID]?.rpcUrl || 'https://rpc.ankr.com/solana',
  'https://api.mainnet-beta.solana.com',
];

let _connection: Connection | null = null;
let _rpcIndex = 0;

function getConnection(): Connection {
  if (!_connection) {
    _connection = new Connection(SOLANA_RPC_URLS[_rpcIndex], 'confirmed');
  }
  return _connection;
}

function switchRpc(): Connection {
  _rpcIndex = (_rpcIndex + 1) % SOLANA_RPC_URLS.length;
  _connection = new Connection(SOLANA_RPC_URLS[_rpcIndex], 'confirmed');
  return _connection;
}

/** Get the Phantom Solana provider */
export function getPhantomSolana(): SolanaProvider | null {
  if (typeof window === 'undefined') return null;
  return window.phantom?.solana || null;
}

// ========================================
// Balance
// ========================================

/** Get SOL balance (with RPC fallback) */
export async function getSolBalance(walletAddress: string): Promise<string> {
  const pubkey = new PublicKey(walletAddress);
  try {
    const lamports = await getConnection().getBalance(pubkey);
    return (lamports / LAMPORTS_PER_SOL).toFixed(9);
  } catch {
    // Try fallback RPC
    const lamports = await switchRpc().getBalance(pubkey);
    return (lamports / LAMPORTS_PER_SOL).toFixed(9);
  }
}

/** Get SPL token balance (with RPC fallback) */
export async function getSplTokenBalance(
  mintAddress: string,
  walletAddress: string,
  decimals: number = 6,
): Promise<string> {
  const walletPubkey = new PublicKey(walletAddress);
  const mintPubkey = new PublicKey(mintAddress);
  const ata = await getAssociatedTokenAddress(mintPubkey, walletPubkey);

  async function fetchFromConn(conn: Connection): Promise<string> {
    try {
      const account = await getAccount(conn, ata);
      const raw = Number(account.amount);
      return (raw / 10 ** decimals).toFixed(decimals);
    } catch {
      return '0';
    }
  }

  try {
    return await fetchFromConn(getConnection());
  } catch {
    return await fetchFromConn(switchRpc());
  }
}

/** Get balance for any Solana token (native SOL or SPL) */
export async function getSolanaBalance(
  token: TokenConfig,
  walletAddress: string,
): Promise<string> {
  const addr = token.addresses[SOLANA_CHAIN_ID];
  if (!addr) return '0';

  if (addr === SOLANA_NATIVE) {
    return getSolBalance(walletAddress);
  }
  return getSplTokenBalance(addr, walletAddress, token.decimals);
}

// ========================================
// Transfers
// ========================================

export interface TransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

/** Send native SOL to platform wallet */
export async function sendSol(
  amount: string,
): Promise<TransferResult> {
  try {
    const phantom = getPhantomSolana();
    if (!phantom?.publicKey) return { success: false, error: 'Phantom Solana wallet not connected' };

    const conn = getConnection();
    const from = phantom.publicKey;
    const to = new PublicKey(getSolanaPlatformWallet());
    const lamports = Math.round(parseFloat(amount) * LAMPORTS_PER_SOL);

    // Check balance first
    const balance = await conn.getBalance(from);
    if (balance < lamports + 5000) {
      return { success: false, error: `Insufficient SOL balance. You have ${(balance / LAMPORTS_PER_SOL).toFixed(6)} SOL.` };
    }

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports,
      }),
    );
    tx.feePayer = from;
    tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;

    const { signature } = await phantom.signAndSendTransaction(tx);
    return { success: true, txHash: signature };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('User rejected') || msg.includes('rejected')) {
      return { success: false, error: 'Transaction rejected by user' };
    }
    return { success: false, error: msg };
  }
}

/** Send SPL token to platform wallet */
export async function sendSplToken(
  mintAddress: string,
  amount: string,
  decimals: number = 6,
  symbol: string = 'tokens',
): Promise<TransferResult> {
  try {
    const phantom = getPhantomSolana();
    if (!phantom?.publicKey) return { success: false, error: 'Phantom Solana wallet not connected' };

    const conn = getConnection();
    const from = phantom.publicKey;
    const mintPubkey = new PublicKey(mintAddress);
    const toPubkey = new PublicKey(getSolanaPlatformWallet());

    const fromAta = await getAssociatedTokenAddress(mintPubkey, from);
    const toAta = await getAssociatedTokenAddress(mintPubkey, toPubkey);

    // Check balance
    try {
      const account = await getAccount(conn, fromAta);
      const rawAmount = BigInt(Math.round(parseFloat(amount) * 10 ** decimals));
      if (account.amount < rawAmount) {
        const have = Number(account.amount) / 10 ** decimals;
        return { success: false, error: `Insufficient ${symbol} balance. You have ${have.toFixed(6)} ${symbol}.` };
      }
    } catch {
      return { success: false, error: `No ${symbol} found in your wallet on Solana.` };
    }

    const rawAmount = BigInt(Math.round(parseFloat(amount) * 10 ** decimals));

    const tx = new Transaction().add(
      createTransferInstruction(
        fromAta,
        toAta,
        from,
        rawAmount,
        [],
        TOKEN_PROGRAM_ID,
      ),
    );
    tx.feePayer = from;
    tx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;

    const { signature } = await phantom.signAndSendTransaction(tx);
    return { success: true, txHash: signature };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('User rejected') || msg.includes('rejected')) {
      return { success: false, error: 'Transaction rejected by user' };
    }
    return { success: false, error: msg };
  }
}

/** Execute a Solana swap (transfer to platform wallet) */
export async function executeSolanaSwap(
  token: TokenConfig,
  amount: string,
): Promise<TransferResult> {
  const addr = token.addresses[SOLANA_CHAIN_ID];
  if (!addr) return { success: false, error: `${token.symbol} is not available on Solana` };

  if (addr === SOLANA_NATIVE) {
    return sendSol(amount);
  }
  return sendSplToken(addr, amount, token.decimals, token.symbol);
}

/** Wait for Solana transaction confirmation */
export async function waitForSolanaTransaction(signature: string): Promise<{
  success: boolean;
  blockNumber?: number;
}> {
  try {
    const conn = getConnection();
    const result = await conn.confirmTransaction(signature, 'confirmed');
    return { success: !result.value.err };
  } catch {
    return { success: false };
  }
}
