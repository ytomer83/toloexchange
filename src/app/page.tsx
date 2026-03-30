'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowDownUp, ChevronDown, X, Search, Shield, Zap, Globe, ArrowRight } from 'lucide-react';

interface Token {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  networks: string[];
  popular?: boolean;
}

const tokens: Token[] = [
  { symbol: 'USDC', name: 'USD Coin', icon: '💲', color: '#2775ca', networks: ['Ethereum', 'Polygon', 'BSC', 'Solana', 'Arbitrum'], popular: true },
  { symbol: 'USDT', name: 'Tether', icon: '₮', color: '#26a17b', networks: ['Ethereum', 'Polygon', 'BSC', 'Solana', 'Tron', 'Arbitrum'], popular: true },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627eea', networks: ['Ethereum', 'Arbitrum', 'Optimism'], popular: true },
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#f7931a', networks: ['Bitcoin'], popular: true },
  { symbol: 'SOL', name: 'Solana', icon: '◎', color: '#9945ff', networks: ['Solana'], popular: true },
  { symbol: 'BNB', name: 'BNB', icon: '⬡', color: '#f3ba2f', networks: ['BSC'], popular: true },
  { symbol: 'DAI', name: 'Dai', icon: '◈', color: '#f5ac37', networks: ['Ethereum', 'Polygon', 'Arbitrum'] },
  { symbol: 'XRP', name: 'Ripple', icon: '✕', color: '#23292f', networks: ['XRP Ledger'] },
  { symbol: 'MATIC', name: 'Polygon', icon: '⬡', color: '#8247e5', networks: ['Polygon', 'Ethereum'] },
  { symbol: 'AVAX', name: 'Avalanche', icon: '▲', color: '#e84142', networks: ['Avalanche'] },
  { symbol: 'DOT', name: 'Polkadot', icon: '●', color: '#e6007a', networks: ['Polkadot'] },
  { symbol: 'LINK', name: 'Chainlink', icon: '⬡', color: '#2a5ada', networks: ['Ethereum'] },
  { symbol: 'ADA', name: 'Cardano', icon: '₳', color: '#0033ad', networks: ['Cardano'] },
  { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', color: '#c3a634', networks: ['Dogecoin'] },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', color: '#ff007a', networks: ['Ethereum'] },
  { symbol: 'AAVE', name: 'Aave', icon: '👻', color: '#b6509e', networks: ['Ethereum', 'Polygon'] },
  { symbol: 'ARB', name: 'Arbitrum', icon: '🔵', color: '#28a0f0', networks: ['Arbitrum'] },
  { symbol: 'OP', name: 'Optimism', icon: '🔴', color: '#ff0420', networks: ['Optimism'] },
  { symbol: 'LTC', name: 'Litecoin', icon: 'Ł', color: '#bfbbbb', networks: ['Litecoin'] },
  { symbol: 'SHIB', name: 'Shiba Inu', icon: '🐕', color: '#fda32b', networks: ['Ethereum'] },
];

// Simulated exchange rates relative to USD
const rates: Record<string, number> = {
  USDC: 1, USDT: 1, DAI: 1,
  ETH: 3245.50, BTC: 67234.00, SOL: 148.30,
  BNB: 598.70, XRP: 0.628, MATIC: 0.72,
  AVAX: 35.80, DOT: 7.25, LINK: 14.90,
  ADA: 0.45, DOGE: 0.165, UNI: 7.82,
  AAVE: 92.50, ARB: 1.12, OP: 2.35,
  LTC: 84.20, SHIB: 0.0000245,
};

const FEE_RATE = 0.005; // 0.5%

function TokenIcon({ token, size = 36 }: { token: Token; size?: number }) {
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

function TokenSelector({ isOpen, onClose, onSelect, excludeSymbol }: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  excludeSymbol: string;
}) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = tokens.filter(t =>
    t.symbol !== excludeSymbol &&
    (t.symbol.toLowerCase().includes(search.toLowerCase()) ||
     t.name.toLowerCase().includes(search.toLowerCase()))
  );

  const popular = filtered.filter(t => t.popular);
  const rest = filtered.filter(t => !t.popular);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in" style={{ background: 'var(--bg-secondary)' }}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Select a token</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
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

        {/* Popular tokens */}
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

        {/* Token list */}
        <div className="border-t border-[var(--border)] max-h-[320px] overflow-y-auto">
          {(search ? filtered : [...popular, ...rest]).map(token => (
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
              <div className="text-[10px] text-[var(--text-muted)]">
                {token.networks[0]}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-[var(--text-muted)]">No tokens found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SwapPage() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0]); // USDC
  const [toToken, setToToken] = useState<Token>(tokens[1]); // USDT
  const [fromAmount, setFromAmount] = useState('');
  const [selectorOpen, setSelectorOpen] = useState<'from' | 'to' | null>(null);

  const getRate = useCallback(() => {
    const fromRate = rates[fromToken.symbol] || 1;
    const toRate = rates[toToken.symbol] || 1;
    return fromRate / toRate;
  }, [fromToken.symbol, toToken.symbol]);

  const toAmount = fromAmount
    ? (parseFloat(fromAmount) * getRate() * (1 - FEE_RATE)).toFixed(
        rates[toToken.symbol] >= 100 ? 6 : rates[toToken.symbol] >= 1 ? 4 : 8
      )
    : '';

  const feeAmount = fromAmount
    ? (parseFloat(fromAmount) * getRate() * FEE_RATE).toFixed(
        rates[toToken.symbol] >= 100 ? 6 : rates[toToken.symbol] >= 1 ? 4 : 8
      )
    : '';

  const handleSwapTokens = () => {
    const tmp = fromToken;
    setFromToken(toToken);
    setToToken(tmp);
    setFromAmount('');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col">
      {/* Hero + Swap */}
      <section className="flex-1 flex flex-col items-center justify-center relative py-12 px-4">
        {/* Background effects */}
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
            {/* From */}
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-input)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[var(--text-muted)]">You pay</span>
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

            {/* Swap button */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={handleSwapTokens}
                className="w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all hover:rotate-180 duration-300"
                style={{
                  background: 'var(--bg-secondary)',
                  borderColor: 'var(--border-light)',
                }}
              >
                <ArrowDownUp className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>

            {/* To */}
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

            {/* Rate & Fee info */}
            {fromAmount && parseFloat(fromAmount) > 0 && (
              <div className="mt-3 px-1 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Rate</span>
                  <span className="text-[var(--text-secondary)]">
                    1 {fromToken.symbol} = {getRate().toFixed(rates[toToken.symbol] >= 100 ? 6 : rates[toToken.symbol] >= 1 ? 4 : 8)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Fee (0.5%)</span>
                  <span className="text-[var(--text-secondary)]">{feeAmount} {toToken.symbol}</span>
                </div>
              </div>
            )}

            {/* Swap button */}
            <button
              className="w-full mt-4 py-4 rounded-xl text-base font-semibold btn-primary"
              disabled={!fromAmount || parseFloat(fromAmount) <= 0}
            >
              {!fromAmount || parseFloat(fromAmount) <= 0
                ? 'Enter an amount'
                : 'Connect Wallet to Swap'}
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
                Swap across Ethereum, Solana, BSC, Polygon, Arbitrum, and more.
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
              { step: '3', title: 'Confirm & Swap', desc: 'Review the rate and 0.5% fee, then confirm the swap in your wallet.' },
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
        onSelect={setFromToken}
        excludeSymbol={toToken.symbol}
      />
      <TokenSelector
        isOpen={selectorOpen === 'to'}
        onClose={() => setSelectorOpen(null)}
        onSelect={setToToken}
        excludeSymbol={fromToken.symbol}
      />
    </div>
  );
}
