'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowDownUp, ChevronDown, X, Search, Shield, Zap, Globe, ArrowRight, ExternalLink, Loader2, Check, AlertTriangle, Lock, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { getSupportedEcosystems } from '@/context/WalletContext';
import { TOKENS, CHAINS, getTokensForChain, isNativeToken, isSolanaChain, getExplorerTxUrl, SOLANA_CHAIN_ID, type TokenConfig, NATIVE_ADDRESS } from '@/lib/tokens';
import { getBalance, executeSwap, waitForTransaction, getPlatformWallet, switchChain } from '@/lib/web3';
import { getSolanaBalance, executeSolanaSwap, waitForSolanaTransaction } from '@/lib/solana';

// Simulated exchange rates relative to USD (in production, use a price oracle)
const USD_RATES: Record<string, number> = {
  USDC: 1, USDT: 1, DAI: 1,
  SOL: 147.50,
  ETH: 3245.50, WETH: 3245.50, BNB: 598.70, POL: 0.72,
  AVAX: 35.80, LINK: 14.90, UNI: 7.82,
  AAVE: 92.50, ARB: 1.12, OP: 2.35,
};

const FEE_RATE = 0; // 0%, free swaps on all currencies

type SwapStep = 'idle' | 'confirming' | 'sending' | 'waiting' | 'success' | 'error';

// ========================================
// Token Icon Component
// ========================================
function TokenIcon({ token, size = 36 }: { token: TokenConfig; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        background: `${token.color}18`,
        border: `1.5px solid ${token.color}25`,
      }}
    >
      <img
        src={token.image}
        alt={token.symbol}
        width={size * 0.75}
        height={size * 0.75}
        className="object-contain"
        onError={(e) => {
          // Fallback to text icon if image fails
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `<span style="font-size:${size * 0.4}px;color:${token.color}">${token.icon}</span>`;
        }}
      />
    </div>
  );
}

// ========================================
// Token Selector Modal
// ========================================
function TokenSelector({ isOpen, onClose, onSelect, excludeSymbol, chainId }: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: TokenConfig) => void;
  excludeSymbol: string;
  chainId: number | null;
}) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) setSearch('');
  }, [isOpen]);

  if (!isOpen) return null;

  // Show tokens available on current chain, or all tokens if no chain
  const availableTokens = chainId ? getTokensForChain(chainId) : TOKENS;

  const filtered = availableTokens.filter(t =>
    t.symbol !== excludeSymbol &&
    (t.symbol.toLowerCase().includes(search.toLowerCase()) ||
     t.name.toLowerCase().includes(search.toLowerCase()))
  );

  const popular = filtered.filter(t => t.popular);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in soft-shadow" style={{ background: 'var(--bg-card)' }}>
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text-primary)] text-sm">Select a token</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border)]" style={{ background: 'var(--bg-input)' }}>
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or symbol"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] w-full"
              autoFocus
            />
          </div>
        </div>

        {!search && popular.length > 0 && (
          <div className="px-3 pb-2 flex flex-wrap gap-2">
            {popular.map(token => (
              <button
                key={token.symbol}
                onClick={() => { onSelect(token); onClose(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors text-xs"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <TokenIcon token={token} size={18} />
                <span className="text-[var(--text-primary)] font-medium">{token.symbol}</span>
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-[var(--border)] max-h-[320px] overflow-y-auto">
          {filtered.map(token => (
            <button
              key={token.symbol}
              onClick={() => { onSelect(token); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <TokenIcon token={token} size={36} />
              <div className="text-left flex-1">
                <div className="text-sm font-medium text-[var(--text-primary)]">{token.symbol}</div>
                <div className="text-xs text-[var(--text-muted)]">{token.name}</div>
              </div>
              {chainId && (
                <div className="text-[10px] text-[var(--text-muted)]">
                  {isNativeToken(token, chainId) ? 'Native' : 'ERC-20'}
                </div>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--text-muted)]">
              {chainId ? `No tokens found on ${CHAINS[chainId]?.shortName || 'this chain'}` : 'No tokens found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// Confirmation / Status Modal
// ========================================
function SwapStatusModal({ step, fromToken, toToken, fromAmount, toAmount, feeAmount, txHash, chainId, error, onClose, onRetry }: {
  step: SwapStep;
  fromToken: TokenConfig;
  toToken: TokenConfig;
  fromAmount: string;
  toAmount: string;
  feeAmount: string;
  txHash: string;
  chainId: number;
  error: string;
  onClose: () => void;
  onRetry: () => void;
}) {
  if (step === 'idle') return null;

  const explorerUrl = txHash ? getExplorerTxUrl(chainId, txHash) : '';
  const chainName = CHAINS[chainId]?.shortName || '';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in soft-shadow" style={{ background: 'var(--bg-card)' }}>
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-semibold text-[var(--text-primary)] text-sm">
            {step === 'confirming' && 'Confirm Swap'}
            {step === 'sending' && 'Sending Transaction'}
            {step === 'waiting' && 'Processing'}
            {step === 'success' && 'Swap Submitted'}
            {step === 'error' && 'Transaction Failed'}
          </h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5">
          {/* Confirming, show swap details */}
          {step === 'confirming' && (
            <div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">You send</div>
                    <div className="text-lg font-semibold text-[var(--text-primary)]">{fromAmount} {fromToken.symbol}</div>
                  </div>
                  <TokenIcon token={fromToken} size={36} />
                </div>
                <div className="flex justify-center"><ArrowDownUp className="w-4 h-4 text-[var(--text-muted)]" /></div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">You receive</div>
                    <div className="text-lg font-semibold text-[var(--text-primary)]">{toAmount} {toToken.symbol}</div>
                  </div>
                  <TokenIcon token={toToken} size={36} />
                </div>
              </div>

              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Fee</span><span className="text-[var(--green)] font-semibold">FREE (0%)</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Network</span><span className="text-[var(--text-secondary)]">{chainName}</span></div>
                {!isNativeToken(fromToken, chainId) && (
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Type</span><span className="text-[var(--text-secondary)]">Token Transfer</span></div>
                )}
              </div>

              <div className="rounded-xl p-3 mb-4 text-xs" style={{ background: 'rgba(47, 138, 245, 0.06)', border: '1px solid rgba(47, 138, 245, 0.12)' }}>
                <p className="text-[var(--text-secondary)]">
                  Your {fromToken.symbol} will be sent to our platform wallet. You will receive the full amount in {toToken.symbol} to your connected wallet shortly after confirmation, with zero fees.
                </p>
              </div>

              <button
                onClick={onRetry}
                className="w-full py-3.5 rounded-xl text-sm font-semibold btn-primary"
              >
                Confirm Swap
              </button>
            </div>
          )}

          {/* Sending, loading state */}
          {step === 'sending' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                Confirm transfer in your wallet
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                Sending {fromAmount} {fromToken.symbol} to TOLO platform wallet.
              </p>
            </div>
          )}

          {/* Waiting for confirmation */}
          {step === 'waiting' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)] mb-2">Transaction Submitted</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Waiting for blockchain confirmation...</p>
              {txHash && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline"
                >
                  View on {CHAINS[chainId]?.explorerName} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(33, 193, 135, 0.12)' }}>
                <Check className="w-8 h-8 text-[var(--green)]" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)] mb-2">Swap Confirmed!</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                {fromAmount} {fromToken.symbol} has been received.
              </p>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                You will receive <span className="text-[var(--text-primary)] font-semibold">{toAmount} {toToken.symbol}</span> to your wallet shortly.
              </p>

              {txHash && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline mb-4"
                >
                  View transaction <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                onClick={onClose}
                className="w-full mt-4 py-3 rounded-xl text-sm font-semibold btn-primary"
              >
                Done
              </button>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(240, 72, 50, 0.12)' }}>
                <AlertTriangle className="w-8 h-8 text-[var(--red)]" />
              </div>
              <h4 className="text-base font-semibold text-[var(--text-primary)] mb-2">Transaction Failed</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4 break-words max-w-xs mx-auto">{error}</p>
              <button
                onClick={onRetry}
                className="w-full py-3 rounded-xl text-sm font-semibold btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ========================================
// Chain Selector for when not connected
// ========================================
function ChainSelector({ chainId, onChange }: { chainId: number; onChange: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const chain = CHAINS[chainId];

  // Group chains by ecosystem
  const evmChains = Object.values(CHAINS).filter(c => c.ecosystem === 'evm');
  const solanaChain = Object.values(CHAINS).find(c => c.ecosystem === 'solana');

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: chain?.ecosystem === 'solana' ? '#9945ff' : 'var(--accent)' }} />
        <span className="text-[var(--text-secondary)]">{chain?.shortName}</span>
        <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-48 rounded-xl border border-[var(--border)] overflow-hidden z-50" style={{ background: 'var(--bg-card)' }}>
          {solanaChain && (
            <>
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider" style={{ background: 'var(--bg-tertiary)' }}>Solana</div>
              <button
                onClick={() => { onChange(solanaChain.chainId); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors ${solanaChain.chainId === chainId ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}
              >
                Solana
              </button>
            </>
          )}
          <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider" style={{ background: 'var(--bg-tertiary)' }}>EVM</div>
          {evmChains.map(c => (
            <button
              key={c.chainId}
              onClick={() => { onChange(c.chainId); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors ${c.chainId === chainId ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              {c.shortName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// Main Swap Page
// ========================================
export default function SwapPage() {
  const wallet = useWallet();

  // Chain state: use wallet chain when connected, default to Ethereum
  const activeChainId = (wallet.connected && wallet.chainId && wallet.isSupported) ? wallet.chainId : 1;
  const [selectedChainId, setSelectedChainId] = useState(1);
  const chainId = wallet.connected ? activeChainId : selectedChainId;

  // Get available tokens for current chain
  const availableTokens = getTokensForChain(chainId);

  // Token selection
  const [fromToken, setFromToken] = useState<TokenConfig>(availableTokens.find(t => t.symbol === 'USDC') || availableTokens[0]);
  const [toToken, setToToken] = useState<TokenConfig>(availableTokens.find(t => t.symbol === 'USDT') || availableTokens[1] || availableTokens[0]);
  const [fromAmount, setFromAmount] = useState('');
  const [selectorOpen, setSelectorOpen] = useState<'from' | 'to' | null>(null);

  // Balances
  const [fromBalance, setFromBalance] = useState<string | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(false);

  // Swap state
  const [swapStep, setSwapStep] = useState<SwapStep>('idle');
  const [txHash, setTxHash] = useState('');
  const [swapError, setSwapError] = useState('');

  // When chain changes, reset tokens to available ones
  useEffect(() => {
    const tokens = getTokensForChain(chainId);
    if (tokens.length > 0) {
      if (isSolanaChain(chainId)) {
        const sol = tokens.find(t => t.symbol === 'SOL');
        const usdc = tokens.find(t => t.symbol === 'USDC');
        setFromToken(sol || tokens[0]);
        setToToken(usdc || tokens.find(t => t !== (sol || tokens[0])) || tokens[0]);
      } else {
        const usdc = tokens.find(t => t.symbol === 'USDC');
        const usdt = tokens.find(t => t.symbol === 'USDT');
        const eth = tokens.find(t => t.symbol === 'ETH');
        setFromToken(usdc || eth || tokens[0]);
        setToToken(usdt || (usdc ? tokens.find(t => t.symbol !== 'USDC') : tokens.find(t => t !== (usdc || eth || tokens[0]))) || tokens[0]);
      }
    }
  }, [chainId]);

  // Fetch balance when wallet connected
  useEffect(() => {
    if (!wallet.connected || !wallet.address || !wallet.isSupported) {
      setFromBalance(null);
      return;
    }

    let cancelled = false;
    setLoadingBalance(true);

    const fetchBalance = isSolanaChain(chainId)
      ? getSolanaBalance(fromToken, wallet.address)
      : getBalance(fromToken, chainId, wallet.address);

    fetchBalance
      .then(bal => {
        if (!cancelled) {
          setFromBalance(parseFloat(bal).toFixed(6));
          setLoadingBalance(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFromBalance(null);
          setLoadingBalance(false);
        }
      });

    return () => { cancelled = true; };
  }, [wallet.connected, wallet.address, wallet.isSupported, fromToken, chainId]);

  // Calculate output amount
  const getRate = useCallback(() => {
    const fromRate = USD_RATES[fromToken.symbol] || 1;
    const toRate = USD_RATES[toToken.symbol] || 1;
    return fromRate / toRate;
  }, [fromToken.symbol, toToken.symbol]);

  const numFromAmount = parseFloat(fromAmount) || 0;
  const rate = getRate();
  const outputBeforeFee = numFromAmount * rate;
  const fee = outputBeforeFee * FEE_RATE;
  const outputAfterFee = outputBeforeFee - fee;

  const formatOutput = (val: number) => {
    if (val === 0) return '0';
    const toRate = USD_RATES[toToken.symbol] || 1;
    if (toRate >= 100) return val.toFixed(6);
    if (toRate >= 1) return val.toFixed(4);
    return val.toFixed(8);
  };

  const toAmount = numFromAmount > 0 ? formatOutput(outputAfterFee) : '';
  const feeAmount = numFromAmount > 0 ? formatOutput(fee) : '';

  // Swap token positions
  const handleSwapTokens = () => {
    const tmp = fromToken;
    setFromToken(toToken);
    setToToken(tmp);
    setFromAmount('');
  };

  // Handle token selection ensuring they're different
  const handleSelectFrom = (token: TokenConfig) => {
    if (token.symbol === toToken.symbol) {
      setToToken(fromToken);
    }
    setFromToken(token);
    setFromAmount('');
  };

  const handleSelectTo = (token: TokenConfig) => {
    if (token.symbol === fromToken.symbol) {
      setFromToken(toToken);
    }
    setToToken(token);
  };

  // Set max amount
  const handleMax = () => {
    if (fromBalance) {
      // Leave a little for gas if native token
      if (isNativeToken(fromToken, chainId)) {
        const max = Math.max(0, parseFloat(fromBalance) - 0.005);
        setFromAmount(max.toFixed(6));
      } else {
        setFromAmount(fromBalance);
      }
    }
  };

  // Execute swap
  const handleSwap = async () => {
    if (!wallet.connected) {
      wallet.setOpenConnectModal(true);
      return;
    }

    if (!wallet.isSupported) {
      // Try switching chain
      const success = await switchChain(selectedChainId);
      if (!success) {
        setSwapError(`Please switch to a supported network. Supported: ${Object.values(CHAINS).map(c => c.shortName).join(', ')}`);
        setSwapStep('error');
      }
      return;
    }

    // Show confirmation
    setSwapStep('confirming');
  };

  const handleConfirmSwap = async () => {
    try {
      setSwapStep('sending');

      const solana = isSolanaChain(chainId);
      const result = solana
        ? await executeSolanaSwap(fromToken, fromAmount)
        : await executeSwap(fromToken, chainId, fromAmount, wallet.address);

      if (!result.success) {
        setSwapError(result.error || 'Transaction failed');
        setSwapStep('error');
        return;
      }

      setTxHash(result.txHash || '');
      setSwapStep('waiting');

      const confirmation = solana
        ? await waitForSolanaTransaction(result.txHash!)
        : await waitForTransaction(result.txHash!);

      if (confirmation.success) {
        setSwapStep('success');
      } else {
        setSwapError('Transaction failed on-chain. Please try again.');
        setSwapStep('error');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSwapError(message);
      setSwapStep('error');
    }
  };

  const resetSwap = () => {
    setSwapStep('idle');
    setTxHash('');
    setSwapError('');
    setFromAmount('');
  };

  // Determine CTA state
  const insufficientBalance = wallet.connected && fromBalance !== null && numFromAmount > parseFloat(fromBalance);
  const balanceUnknown = wallet.connected && wallet.isSupported && fromBalance === null && !loadingBalance;
  const tokenNotOnChain = wallet.connected && wallet.isSupported && !fromToken.addresses[chainId];

  let ctaText = 'Connect Wallet';
  let ctaDisabled = false;

  if (wallet.connected) {
    if (!wallet.isSupported) {
      ctaText = 'Switch to Supported Network';
    } else if (numFromAmount <= 0) {
      ctaText = 'Enter an amount';
      ctaDisabled = true;
    } else if (tokenNotOnChain) {
      ctaText = `${fromToken.symbol} not available on ${CHAINS[chainId]?.shortName}`;
      ctaDisabled = true;
    } else if (loadingBalance) {
      ctaText = 'Loading balance...';
      ctaDisabled = true;
    } else if (balanceUnknown) {
      ctaText = 'Unable to load balance, retry';
      ctaDisabled = false;
    } else if (insufficientBalance) {
      ctaText = `Insufficient ${fromToken.symbol} balance`;
      ctaDisabled = true;
    } else {
      ctaText = 'Swap';
    }
  }

  // Check platform wallet config
  let platformConfigured = true;
  try { getPlatformWallet(); } catch { platformConfigured = false; }

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Hero + Swap */}
      <section className="flex-1 flex flex-col items-center justify-center relative py-12 px-4">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(47, 138, 245, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(33, 193, 135, 0.04) 0%, transparent 40%)'
        }} />

        {/* Tagline */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 text-xs font-semibold" style={{ background: 'rgba(33, 193, 135, 0.12)', border: '1px solid rgba(33, 193, 135, 0.3)', color: 'var(--green)' }}>
            ✨ 0% FEE, FREE SWAPS ON ALL CURRENCIES
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
            Swap Digital Assets
          </h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md mx-auto">
            Connect your wallet, choose your tokens, swap instantly. Zero fees on every swap, completely free.
          </p>
        </div>

        {/* Swap Card */}
        <div className="w-full max-w-[460px] relative z-10">
          <div className="rounded-2xl border border-[var(--border-light)] p-4 swap-glow" style={{ background: 'var(--bg-secondary)' }}>
            {/* Chain selector (visible when not connected) */}
            {!wallet.connected && (
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[var(--text-muted)]">Network</span>
                <ChainSelector chainId={selectedChainId} onChange={setSelectedChainId} />
              </div>
            )}

            {/* Ecosystem switcher (visible when connected with multi-ecosystem wallet) */}
            {wallet.connected && getSupportedEcosystems(wallet.walletType).length > 1 && (
              <div className="flex items-center gap-1.5 mb-3 p-1 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                {getSupportedEcosystems(wallet.walletType).map(eco => (
                  <button
                    key={eco}
                    onClick={() => wallet.switchEcosystem(eco)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                      wallet.ecosystem === eco
                        ? 'text-[var(--text-primary)] shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                    }`}
                    style={wallet.ecosystem === eco ? { background: 'var(--bg-card)' } : {}}
                  >
                    {eco === 'solana' ? '◎ Solana' : '⟠ EVM'}
                  </button>
                ))}
              </div>
            )}

            {/* Unsupported chain warning */}
            {wallet.connected && !wallet.isSupported && (
              <div className="rounded-xl p-3 mb-3 text-xs flex items-center gap-2" style={{ background: 'rgba(240, 72, 50, 0.08)', border: '1px solid rgba(240, 72, 50, 0.2)' }}>
                <AlertTriangle className="w-4 h-4 text-[var(--red)] shrink-0" />
                <span className="text-[var(--red)]">Unsupported network. Please switch to Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Base, or Solana.</span>
              </div>
            )}

            {/* Zero-balance hint */}
            {wallet.connected && wallet.isSupported && !loadingBalance && fromBalance !== null && parseFloat(fromBalance) === 0 && (
              <div className="rounded-xl p-3 mb-3 text-xs flex items-start gap-2" style={{ background: 'rgba(10, 102, 255, 0.06)', border: '1px solid rgba(10, 102, 255, 0.15)' }}>
                <AlertTriangle className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">
                  No {fromToken.symbol} found on <strong>{CHAINS[chainId]?.shortName}</strong>. If your wallet holds {fromToken.symbol} on another network, switch networks in your wallet first.
                </span>
              </div>
            )}

            {/* FROM input */}
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">You pay</span>
                {wallet.connected && wallet.isSupported && (
                  <button onClick={handleMax} className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                    {loadingBalance
                      ? 'Loading balance...'
                      : fromBalance !== null
                        ? `Balance: ${fromBalance} ${fromToken.symbol} on ${CHAINS[chainId]?.shortName}`
                        : `Balance unavailable`}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0"
                  value={fromAmount}
                  onChange={e => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-2xl md:text-3xl font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] min-w-0"
                />
                <button
                  onClick={() => setSelectorOpen('from')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors shrink-0"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <TokenIcon token={fromToken} size={24} />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{fromToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            {/* Swap direction button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleSwapTokens}
                className="w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all hover:rotate-180 duration-300"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-light)' }}
              >
                <ArrowDownUp className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* TO output */}
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">You receive</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 text-2xl md:text-3xl font-semibold min-w-0 truncate" style={{ color: toAmount ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {toAmount || '0'}
                </div>
                <button
                  onClick={() => setSelectorOpen('to')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors shrink-0"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <TokenIcon token={toToken} size={24} />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{toToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>
            </div>

            {/* Rate & fee info */}
            {numFromAmount > 0 && (
              <div className="mt-3 px-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Rate</span>
                  <span className="text-[var(--text-secondary)]">
                    1 {fromToken.symbol} = {formatOutput(rate)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Fee</span>
                  <span className="text-[var(--green)] font-semibold">FREE (0%)</span>
                </div>
                {wallet.connected && wallet.isSupported && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">Network</span>
                    <span className="text-[var(--text-secondary)]">{CHAINS[chainId]?.shortName}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={handleSwap}
              className="w-full mt-4 py-4 rounded-xl text-base font-semibold btn-primary"
              disabled={ctaDisabled || (!platformConfigured && wallet.connected)}
            >
              {!platformConfigured && wallet.connected ? 'Platform wallet not configured' : ctaText}
            </button>
          </div>
        </div>
      </section>

      {/* Stats / Trust bar */}
      <section className="py-10 border-t border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '0%', label: 'Swap fee', sub: 'On every currency' },
              { value: '8+', label: 'Networks', sub: 'EVM + Solana supported' },
              { value: '50+', label: 'Tokens', sub: 'Ready to swap' },
              { value: '24/7', label: 'Available', sub: 'Always on, non-custodial' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight">{s.value}</div>
                <div className="text-sm font-medium text-[var(--text-primary)] mt-1">{s.label}</div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported tokens marquee */}
      <section className="py-12 border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-semibold" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              <Sparkles className="w-3 h-3" />
              SUPPORTED ASSETS
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] tracking-tight">All your favorite tokens</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Swap across the most liquid assets on every major EVM network.</p>
          </div>
          <div className="relative overflow-hidden marquee-mask">
            <div className="flex gap-3 animate-marquee" style={{ width: 'max-content' }}>
              {[...TOKENS, ...TOKENS].map((t, i) => (
                <div
                  key={`${t.symbol}-${i}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] shrink-0"
                  style={{ background: 'var(--bg-card)' }}
                >
                  <TokenIcon token={t} size={22} />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">{t.symbol}</span>
                  <span className="text-xs text-[var(--text-muted)]">{t.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                <Shield className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">FINTRAC Registered</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Fully compliant Money Services Business registered with FINTRAC Canada.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(33, 193, 135, 0.1)' }}>
                <Zap className="w-6 h-6 text-[var(--green)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">0% Fee, Free Swaps</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Simple, transparent pricing. No hidden fees, no slippage surprises.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(151, 71, 255, 0.1)' }}>
                <Globe className="w-6 h-6" style={{ color: '#9747ff' }} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Multi-Chain Support</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Swap across Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Base, and Solana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-[var(--border)]" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[900px] mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Link your MetaMask, Phantom, Trust Wallet, Solflare, or any compatible wallet.' },
              { step: '2', title: 'Choose Tokens', desc: 'Select the token you want to swap from and the token you want to receive.' },
              { step: '3', title: 'Confirm & Swap', desc: 'Review the rate, then confirm the transaction in your wallet. Zero fees, ever.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3" style={{ background: 'var(--accent)' }}>
                  {step}
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                {step !== '3' && (
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] mt-3 rotate-90 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explainer video */}
      <section className="py-20 border-t border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[1000px] mx-auto px-4 lg:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-semibold" style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
              <Sparkles className="w-3 h-3" />
              SEE IT IN ACTION
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
              Watch how TOLO works
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] mt-3 max-w-xl mx-auto">
              A quick walkthrough of swapping digital assets on TOLO with zero fees.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--border)] soft-shadow mx-auto" style={{ background: '#000', maxWidth: 860 }}>
            <video
              controls
              playsInline
              preload="metadata"
              className="w-full block"
              style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
            >
              <source src="/tolo-explainer.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-20 border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-semibold" style={{ background: 'rgba(22, 166, 114, 0.1)', color: 'var(--green)' }}>
              <Shield className="w-3 h-3" />
              BUILT ON TRUST
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
              A safer way to swap digital assets
            </h2>
            <p className="text-sm md:text-base text-[var(--text-secondary)] mt-3 max-w-xl mx-auto">
              Non-custodial, transparent, and registered. Your keys stay yours, your swaps stay free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { icon: Lock, title: 'Non-custodial by design', desc: 'You sign every transaction from your own wallet. TOLO never holds your private keys or your assets between swaps.' },
              { icon: Shield, title: 'FINTRAC registered MSB', desc: 'Operated by Polarbit Solutions Limited, a Money Services Business registered with FINTRAC Canada (MSB C10001398).' },
              { icon: TrendingUp, title: 'Real on-chain settlement', desc: 'Every swap is settled on-chain with a verifiable transaction hash you can inspect on a block explorer.' },
              { icon: Layers, title: 'Multi-chain coverage', desc: 'Swap natively across Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, Base, and Solana from a single interface.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl p-6 border border-[var(--border)] soft-shadow transition-transform hover:-translate-y-0.5"
                style={{ background: 'var(--bg-card)' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--accent-dim)' }}>
                  <Icon className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-1.5">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-[900px] mx-auto px-4 lg:px-6 text-center relative">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(10, 102, 255, 0.08) 0%, transparent 60%)'
          }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
              Ready to swap?
            </h2>
            <p className="text-base text-[var(--text-secondary)] max-w-lg mx-auto mb-8">
              Connect your wallet, pick a pair, and trade with zero fees. No accounts, no waiting.
            </p>
            <button
              onClick={() => {
                if (!wallet.connected) wallet.setOpenConnectModal(true);
                if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold btn-primary"
            >
              {wallet.connected ? 'Start a swap' : 'Connect wallet'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Token Selector Modals */}
      <TokenSelector
        isOpen={selectorOpen === 'from'}
        onClose={() => setSelectorOpen(null)}
        onSelect={handleSelectFrom}
        excludeSymbol={toToken.symbol}
        chainId={chainId}
      />
      <TokenSelector
        isOpen={selectorOpen === 'to'}
        onClose={() => setSelectorOpen(null)}
        onSelect={handleSelectTo}
        excludeSymbol={fromToken.symbol}
        chainId={chainId}
      />

      {/* Swap Status Modal */}
      <SwapStatusModal
        step={swapStep}
        fromToken={fromToken}
        toToken={toToken}
        fromAmount={fromAmount}
        toAmount={toAmount}
        feeAmount={feeAmount}
        txHash={txHash}
        chainId={chainId}
        error={swapError}
        onClose={resetSwap}
        onRetry={swapStep === 'confirming' ? handleConfirmSwap : handleSwap}
      />
    </div>
  );
}
