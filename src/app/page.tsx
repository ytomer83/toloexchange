'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowDownUp, ChevronDown, X, Search, Shield, Zap, Globe, ArrowRight, ExternalLink, Loader2, Check, AlertTriangle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { TOKENS, CHAINS, getTokensForChain, isNativeToken, getExplorerTxUrl, type TokenConfig, NATIVE_ADDRESS } from '@/lib/tokens';
import { getBalance, executeSwap, waitForTransaction, getPlatformWallet, switchChain } from '@/lib/web3';

// Simulated exchange rates relative to USD (in production, use a price oracle)
const USD_RATES: Record<string, number> = {
  USDC: 1, USDT: 1, DAI: 1,
  ETH: 3245.50, WETH: 3245.50, BNB: 598.70, POL: 0.72,
  AVAX: 35.80, LINK: 14.90, UNI: 7.82,
  AAVE: 92.50, ARB: 1.12, OP: 2.35,
};

const FEE_RATE = 0.005; // 0.5%

type SwapStep = 'idle' | 'confirming' | 'approving' | 'sending' | 'waiting' | 'success' | 'error';

// ========================================
// Token Icon Component
// ========================================
function TokenIcon({ token, size = 36 }: { token: TokenConfig; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: `${token.color}22`,
        color: token.color,
        fontSize: size * 0.4,
        border: `1.5px solid ${token.color}33`,
      }}
    >
      {token.icon}
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in" style={{ background: 'var(--bg-secondary)' }}>
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Select a token</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[var(--border)]" style={{ background: 'var(--bg-input)' }}>
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or symbol"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-[var(--text-muted)] w-full"
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
                <span className="text-white font-medium">{token.symbol}</span>
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
                <div className="text-sm font-medium text-white">{token.symbol}</div>
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in" style={{ background: 'var(--bg-secondary)' }}>
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">
            {step === 'confirming' && 'Confirm Swap'}
            {step === 'approving' && 'Approving Token'}
            {step === 'sending' && 'Sending Transaction'}
            {step === 'waiting' && 'Processing'}
            {step === 'success' && 'Swap Submitted'}
            {step === 'error' && 'Transaction Failed'}
          </h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-5">
          {/* Confirming — show swap details */}
          {step === 'confirming' && (
            <div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">You send</div>
                    <div className="text-lg font-semibold text-white">{fromAmount} {fromToken.symbol}</div>
                  </div>
                  <TokenIcon token={fromToken} size={36} />
                </div>
                <div className="flex justify-center"><ArrowDownUp className="w-4 h-4 text-[var(--text-muted)]" /></div>
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-input)' }}>
                  <div>
                    <div className="text-xs text-[var(--text-muted)] mb-1">You receive</div>
                    <div className="text-lg font-semibold text-white">{toAmount} {toToken.symbol}</div>
                  </div>
                  <TokenIcon token={toToken} size={36} />
                </div>
              </div>

              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Fee (0.5%)</span><span className="text-[var(--text-secondary)]">{feeAmount} {toToken.symbol}</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-muted)]">Network</span><span className="text-[var(--text-secondary)]">{chainName}</span></div>
                {!isNativeToken(fromToken, chainId) && (
                  <div className="flex justify-between"><span className="text-[var(--text-muted)]">Requires</span><span className="text-[var(--text-secondary)]">Token approval + Transfer</span></div>
                )}
              </div>

              <div className="rounded-xl p-3 mb-4 text-xs" style={{ background: 'rgba(47, 138, 245, 0.06)', border: '1px solid rgba(47, 138, 245, 0.12)' }}>
                <p className="text-[var(--text-secondary)]">
                  Your {fromToken.symbol} will be sent to our platform wallet. You will receive {toToken.symbol} minus the 0.5% fee to your connected wallet shortly after confirmation.
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

          {/* Approving / Sending — loading state */}
          {(step === 'approving' || step === 'sending') && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">
                {step === 'approving' ? 'Approve in your wallet' : 'Confirm transfer in your wallet'}
              </h4>
              <p className="text-xs text-[var(--text-secondary)]">
                {step === 'approving'
                  ? `Allow TOLO to use your ${fromToken.symbol}. This is a one-time approval.`
                  : `Sending ${fromAmount} ${fromToken.symbol} to TOLO platform wallet.`
                }
              </p>
            </div>
          )}

          {/* Waiting for confirmation */}
          {step === 'waiting' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
              </div>
              <h4 className="text-base font-semibold text-white mb-2">Transaction Submitted</h4>
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
              <h4 className="text-base font-semibold text-white mb-2">Swap Confirmed!</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-2">
                {fromAmount} {fromToken.symbol} has been received.
              </p>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                You will receive <span className="text-white font-semibold">{toAmount} {toToken.symbol}</span> to your wallet shortly.
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
              <h4 className="text-base font-semibold text-white mb-2">Transaction Failed</h4>
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

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors"
        style={{ background: 'var(--bg-tertiary)' }}
      >
        <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
        <span className="text-[var(--text-secondary)]">{chain?.shortName}</span>
        <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-48 rounded-xl border border-[var(--border)] overflow-hidden z-50" style={{ background: 'var(--bg-secondary)' }}>
          {Object.values(CHAINS).map(c => (
            <button
              key={c.chainId}
              onClick={() => { onChange(c.chainId); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors ${c.chainId === chainId ? 'text-white font-medium' : 'text-[var(--text-secondary)]'}`}
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
      const usdc = tokens.find(t => t.symbol === 'USDC');
      const usdt = tokens.find(t => t.symbol === 'USDT');
      const eth = tokens.find(t => t.symbol === 'ETH');

      setFromToken(usdc || eth || tokens[0]);
      setToToken(usdt || (usdc ? tokens.find(t => t.symbol !== 'USDC') : tokens.find(t => t !== (usdc || eth || tokens[0]))) || tokens[0]);
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

    getBalance(fromToken, chainId, wallet.address)
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
      const tokenAddr = fromToken.addresses[chainId];
      const isNative = tokenAddr === NATIVE_ADDRESS;

      // Step 1: Approve (if ERC-20)
      if (!isNative) {
        setSwapStep('approving');
      } else {
        setSwapStep('sending');
      }

      // Execute the swap
      setSwapStep(isNative ? 'sending' : 'approving');
      const result = await executeSwap(fromToken, chainId, fromAmount, wallet.address);

      if (!result.success) {
        setSwapError(result.error || 'Transaction failed');
        setSwapStep('error');
        return;
      }

      // Wait for confirmation
      setTxHash(result.txHash || '');
      setSwapStep('waiting');

      const confirmation = await waitForTransaction(result.txHash!);
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
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
            Swap Digital Assets
          </h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-md mx-auto">
            Connect your wallet, choose your tokens, swap instantly. Flat 0.5% fee on all trades.
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

            {/* Unsupported chain warning */}
            {wallet.connected && !wallet.isSupported && (
              <div className="rounded-xl p-3 mb-3 text-xs flex items-center gap-2" style={{ background: 'rgba(240, 72, 50, 0.08)', border: '1px solid rgba(240, 72, 50, 0.2)' }}>
                <AlertTriangle className="w-4 h-4 text-[var(--red)] shrink-0" />
                <span className="text-[var(--red)]">Unsupported network. Please switch to Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, or Base.</span>
              </div>
            )}

            {/* FROM input */}
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">You pay</span>
                {wallet.connected && fromBalance !== null && (
                  <button onClick={handleMax} className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                    Balance: {loadingBalance ? '...' : fromBalance} {fromToken.symbol}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0"
                  value={fromAmount}
                  onChange={e => setFromAmount(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-2xl md:text-3xl font-semibold text-white placeholder:text-[var(--text-muted)] min-w-0"
                />
                <button
                  onClick={() => setSelectorOpen('from')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors shrink-0"
                  style={{ background: 'var(--bg-secondary)' }}
                >
                  <TokenIcon token={fromToken} size={24} />
                  <span className="text-sm font-semibold text-white">{fromToken.symbol}</span>
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
                  <span className="text-sm font-semibold text-white">{toToken.symbol}</span>
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
                  <span className="text-[var(--text-muted)]">Fee (0.5%)</span>
                  <span className="text-[var(--text-secondary)]">{feeAmount} {toToken.symbol}</span>
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

      {/* Features strip */}
      <section className="py-16 border-t border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}>
                <Shield className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">FINTRAC Registered</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Fully compliant Money Services Business registered with FINTRAC Canada.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(33, 193, 135, 0.1)' }}>
                <Zap className="w-6 h-6 text-[var(--green)]" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Flat 0.5% Fee</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Simple, transparent pricing. No hidden fees, no slippage surprises.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(151, 71, 255, 0.1)' }}>
                <Globe className="w-6 h-6" style={{ color: '#9747ff' }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">Multi-Chain Support</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto">
                Swap across Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche, and Base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-[var(--border)]" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[900px] mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Link your MetaMask, Phantom, Trust Wallet, Solflare, or any compatible wallet.' },
              { step: '2', title: 'Choose Tokens', desc: 'Select the token you want to swap from and the token you want to receive.' },
              { step: '3', title: 'Confirm & Swap', desc: 'Review the rate and 0.5% fee, then confirm the transaction in your wallet.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3" style={{ background: 'var(--accent)' }}>
                  {step}
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                {step !== '3' && (
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] mt-3 rotate-90 md:hidden" />
                )}
              </div>
            ))}
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
