// ========================================
// Web3 Utilities, Token operations
// Uses ethers.js v6
// ========================================

import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';
import { NATIVE_ADDRESS, type TokenConfig, CHAINS } from './tokens';

// Minimal ERC-20 ABI, only what we need
const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

// ========================================
// Platform wallet config
// Set this in .env.local:
//   NEXT_PUBLIC_PLATFORM_WALLET=0xYourWalletAddress
// One address works across all EVM chains
// ========================================
export function getPlatformWallet(): string {
  const wallet = process.env.NEXT_PUBLIC_PLATFORM_WALLET;
  if (!wallet || wallet === '0x0000000000000000000000000000000000000000') {
    throw new Error('Platform wallet not configured. Set NEXT_PUBLIC_PLATFORM_WALLET in .env.local');
  }
  return wallet;
}

// ========================================
// Provider helpers
// ========================================

/** Get ethers BrowserProvider from window.ethereum or wallet-specific provider */
export function getBrowserProvider(): BrowserProvider | null {
  if (typeof window === 'undefined') return null;

  // Check for Phantom's EVM provider first (it's separate from MetaMask's)
  // Read saved wallet type to know which provider to use
  let provider: EthereumProvider | undefined;
  try {
    const saved = localStorage.getItem('tolo_wallet');
    if (saved) {
      const { walletType } = JSON.parse(saved);
      if (walletType === 'phantom' && window.phantom?.ethereum) {
        provider = window.phantom.ethereum;
      }
    }
  } catch {
    // ignore
  }

  if (!provider) {
    provider = window.ethereum;
  }

  if (!provider) return null;
  return new BrowserProvider(provider);
}

/** Get current chain ID */
export async function getChainId(): Promise<number> {
  const provider = getBrowserProvider();
  if (!provider) throw new Error('No wallet connected');
  const network = await provider.getNetwork();
  return Number(network.chainId);
}

/** Switch to a specific chain */
export async function switchChain(chainId: number): Promise<boolean> {
  if (!window.ethereum) return false;
  const chain = CHAINS[chainId];
  if (!chain) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chain.chainIdHex }],
    });
    return true;
  } catch (err: unknown) {
    // Chain not added, try to add it
    const error = err as { code?: number };
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: chain.chainIdHex,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: [chain.rpcUrl],
            blockExplorerUrls: [chain.explorer],
          }],
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

// ========================================
// Balance operations
// ========================================

/** Get native token balance (ETH, BNB, POL, AVAX) */
export async function getNativeBalance(address: string): Promise<string> {
  const provider = getBrowserProvider();
  if (!provider) return '0';
  const balance = await provider.getBalance(address);
  return formatUnits(balance, 18);
}

/** Get ERC-20 token balance */
export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string,
  decimals: number = 18
): Promise<string> {
  const provider = getBrowserProvider();
  if (!provider) return '0';
  const contract = new Contract(tokenAddress, ERC20_ABI, provider);
  const balance = await contract.balanceOf(walletAddress);
  return formatUnits(balance, decimals);
}

/** Get balance for any token (native or ERC-20) */
export async function getBalance(
  token: TokenConfig,
  chainId: number,
  walletAddress: string
): Promise<string> {
  const address = token.addresses[chainId];
  if (!address) return '0';

  if (address === NATIVE_ADDRESS) {
    return getNativeBalance(walletAddress);
  }
  return getTokenBalance(address, walletAddress, token.decimals);
}

// ========================================
// Transfer operations
// ========================================

export interface TransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
}

/** Send native token (ETH/BNB/POL/AVAX) to platform wallet */
export async function sendNativeToken(
  amount: string,
  decimals: number = 18,
  symbol: string = 'tokens'
): Promise<TransferResult> {
  try {
    const provider = getBrowserProvider();
    if (!provider) return { success: false, error: 'No wallet connected' };

    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const platformWallet = getPlatformWallet();
    const value = parseUnits(amount, decimals);

    // Pre-check on-chain balance
    try {
      const onChainBalance: bigint = await provider.getBalance(signerAddress);
      if (onChainBalance < value) {
        const have = formatUnits(onChainBalance, decimals);
        return { success: false, error: `Insufficient ${symbol} balance. You have ${parseFloat(have).toFixed(6)} ${symbol} but tried to swap ${amount} ${symbol}.` };
      }
    } catch {
      // ignore
    }

    const tx = await signer.sendTransaction({
      to: platformWallet,
      value: value,
    });

    return { success: true, txHash: tx.hash };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('user rejected') || message.includes('ACTION_REJECTED')) {
      return { success: false, error: 'Transaction rejected by user' };
    }
    if (message.includes('insufficient funds')) {
      return { success: false, error: `Insufficient ${symbol} balance (or not enough left to cover gas).` };
    }
    return { success: false, error: message };
  }
}

/** Transfer ERC-20 token to platform wallet */
export async function sendERC20Token(
  tokenAddress: string,
  amount: string,
  decimals: number = 18,
  symbol: string = 'tokens'
): Promise<TransferResult> {
  try {
    const provider = getBrowserProvider();
    if (!provider) return { success: false, error: 'No wallet connected' };

    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const contract = new Contract(tokenAddress, ERC20_ABI, signer);
    const platformWallet = getPlatformWallet();
    const value = parseUnits(amount, decimals);

    // Pre-check on-chain balance to avoid a failed transaction
    try {
      const onChainBalance: bigint = await contract.balanceOf(signerAddress);
      if (onChainBalance < value) {
        const have = formatUnits(onChainBalance, decimals);
        return { success: false, error: `Insufficient ${symbol} balance. You have ${parseFloat(have).toFixed(6)} ${symbol} but tried to swap ${amount} ${symbol}.` };
      }
    } catch {
      // If the balance check fails, fall through and let the transfer attempt itself
    }

    const tx = await contract.transfer(platformWallet, value);

    return { success: true, txHash: tx.hash };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('user rejected') || message.includes('ACTION_REJECTED')) {
      return { success: false, error: 'Transaction rejected by user' };
    }
    if (message.includes('transfer amount exceeds balance') || message.includes('exceeds balance')) {
      return { success: false, error: `Insufficient ${symbol} balance for this swap.` };
    }
    if (message.includes('insufficient funds')) {
      return { success: false, error: 'Insufficient funds for gas. Add some native token to cover network fees.' };
    }
    return { success: false, error: message };
  }
}

/** Execute swap: transfer tokens directly to platform wallet */
export async function executeSwap(
  token: TokenConfig,
  chainId: number,
  amount: string,
  _walletAddress?: string
): Promise<TransferResult> {
  const tokenAddress = token.addresses[chainId];
  if (!tokenAddress) {
    return { success: false, error: `${token.symbol} is not available on this chain` };
  }

  // Native token, just send directly
  if (tokenAddress === NATIVE_ADDRESS) {
    return sendNativeToken(amount, token.decimals, token.symbol);
  }

  // ERC-20 token, transfer directly (no approval needed since user calls transfer())
  return sendERC20Token(tokenAddress, amount, token.decimals, token.symbol);
}

/** Wait for transaction confirmation */
export async function waitForTransaction(txHash: string): Promise<{
  success: boolean;
  blockNumber?: number;
  gasUsed?: string;
}> {
  try {
    const provider = getBrowserProvider();
    if (!provider) return { success: false };

    const receipt = await provider.waitForTransaction(txHash, 1, 120000); // 1 confirmation, 2min timeout
    if (!receipt) return { success: false };

    return {
      success: receipt.status === 1,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch {
    return { success: false };
  }
}
