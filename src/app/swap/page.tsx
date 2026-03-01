'use client';

import { useState, useEffect } from 'react';
import { ArrowDownUp, Settings, Info, ChevronDown, RefreshCw } from 'lucide-react';
import { formatPrice } from '@/lib/api';

interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  image: string;
}

const defaultTokens: Token[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 67432.12, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3456.78, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'tether', symbol: 'USDT', name: 'Tether', price: 1.0, image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', price: 1.0, image: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price: 598.45, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 172.34, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', price: 0.5234, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.4567, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price: 0.1234, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', price: 7.23, image: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png' },
];

export default function SwapPage() {
  const [tokens, setTokens] = useState<Token[]>(defaultTokens);
  const [fromToken, setFromToken] = useState<Token>(defaultTokens[2]); // USDT
  const [toToken, setToToken] = useState<Token>(defaultTokens[0]); // BTC
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromSelect, setShowFromSelect] = useState(false);
  const [showToSelect, setShowToSelect] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const ids = defaultTokens.map(t => t.id).join(',');
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        if (res.ok) {
          const data = await res.json();
          setTokens(prev => prev.map(t => ({
            ...t,
            price: data[t.id]?.usd || t.price,
          })));
          setFromToken(prev => ({ ...prev, price: data[prev.id]?.usd || prev.price }));
          setToToken(prev => ({ ...prev, price: data[prev.id]?.usd || prev.price }));
        }
      } catch {
        // use defaults
      }
    }
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000);
    return () => clearInterval(interval);
  }, []);

  const rate = fromToken.price / toToken.price;
  const inverseRate = toToken.price / fromToken.price;

  const handleFromAmountChange = (val: string) => {
    setFromAmount(val);
    if (val && !isNaN(parseFloat(val))) {
      const converted = parseFloat(val) * (fromToken.price / toToken.price);
      setToAmount(converted.toFixed(8));
    } else {
      setToAmount('');
    }
  };

  const handleToAmountChange = (val: string) => {
    setToAmount(val);
    if (val && !isNaN(parseFloat(val))) {
      const converted = parseFloat(val) * (toToken.price / fromToken.price);
      setFromAmount(converted.toFixed(8));
    } else {
      setFromAmount('');
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setFromAmount('');
    setToAmount('');
  };

  const filteredTokens = tokens.filter(t =>
    t.symbol.toLowerCase().includes(searchToken.toLowerCase()) ||
    t.name.toLowerCase().includes(searchToken.toLowerCase())
  );

  const priceImpact = fromAmount ? Math.min(parseFloat(fromAmount) * 0.001 / toToken.price * 100, 5).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Swap</h1>
          <p className="text-sm text-[var(--text-secondary)]">Instantly swap between 200+ tokens at the best rates</p>
        </div>

        {/* Swap Card */}
        <div className="glass-card rounded-2xl p-6 relative">
          {/* Settings */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">Swap Tokens</span>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {showSettings && (
            <div className="mb-4 p-4 rounded-xl border border-[var(--border)]" style={{ background: 'var(--bg-tertiary)' }}>
              <span className="text-xs font-medium text-[var(--text-secondary)]">Slippage Tolerance</span>
              <div className="flex gap-2 mt-2">
                {['0.1', '0.5', '1.0'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      slippage === s ? 'text-white bg-[var(--accent)]' : 'text-[var(--text-secondary)] border border-[var(--border)]'
                    }`}
                  >
                    {s}%
                  </button>
                ))}
                <div className="flex items-center rounded-lg border border-[var(--border)] px-2" style={{ background: 'var(--bg-secondary)' }}>
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-12 bg-transparent text-xs text-white outline-none text-center py-1.5"
                  />
                  <span className="text-xs text-[var(--text-muted)]">%</span>
                </div>
              </div>
            </div>
          )}

          {/* From Token */}
          <div className="rounded-xl p-4 border border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-muted)]">From</span>
              <span className="text-xs text-[var(--text-muted)]">Balance: 10,000.00</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setShowFromSelect(true); setSearchToken(''); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg shrink-0 hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <img src={fromToken.image} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-semibold text-white">{fromToken.symbol}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </button>
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-right text-xl font-medium text-white outline-none"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[var(--text-muted)]">${formatPrice(fromToken.price)}</span>
              <span className="text-xs text-[var(--text-muted)]">
                {fromAmount ? `~$${(parseFloat(fromAmount) * fromToken.price).toFixed(2)}` : ''}
              </span>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center -my-3 relative z-10">
            <button
              onClick={handleSwapTokens}
              className="w-10 h-10 rounded-xl border-4 flex items-center justify-center hover:rotate-180 transition-all duration-300"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-primary)' }}
            >
              <ArrowDownUp className="w-4 h-4 text-[var(--accent)]" />
            </button>
          </div>

          {/* To Token */}
          <div className="rounded-xl p-4 border border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[var(--text-muted)]">To</span>
              <span className="text-xs text-[var(--text-muted)]">Balance: 0.00</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setShowToSelect(true); setSearchToken(''); }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg shrink-0 hover:bg-[var(--bg-tertiary)] transition-colors"
                style={{ background: 'var(--bg-tertiary)' }}
              >
                <img src={toToken.image} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                <span className="text-sm font-semibold text-white">{toToken.symbol}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </button>
              <input
                type="number"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent text-right text-xl font-medium text-white outline-none"
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-[var(--text-muted)]">${formatPrice(toToken.price)}</span>
              <span className="text-xs text-[var(--text-muted)]">
                {toAmount ? `~$${(parseFloat(toAmount) * toToken.price).toFixed(2)}` : ''}
              </span>
            </div>
          </div>

          {/* Swap Details */}
          {fromAmount && parseFloat(fromAmount) > 0 && (
            <div className="mt-4 p-3 rounded-xl text-xs space-y-2" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Rate</span>
                <span className="text-white">1 {fromToken.symbol} = {rate.toFixed(8)} {toToken.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Price Impact</span>
                <span className="text-[var(--green)]">{priceImpact}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Slippage Tolerance</span>
                <span className="text-white">{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Network Fee</span>
                <span className="text-white">~$2.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)] flex items-center gap-1">Min. Received <Info className="w-3 h-3" /></span>
                <span className="text-white">{(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(8)} {toToken.symbol}</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <button
            onClick={handleSwap}
            disabled={!fromAmount || parseFloat(fromAmount) <= 0 || loading}
            className="w-full mt-4 py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Swapping...</>
            ) : !fromAmount || parseFloat(fromAmount) <= 0 ? (
              'Enter an amount'
            ) : (
              `Swap ${fromToken.symbol} for ${toToken.symbol}`
            )}
          </button>
        </div>

        {/* Rate info */}
        <div className="mt-4 glass-card rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--text-secondary)]">Exchange Rate</span>
            <div className="text-white">
              1 {fromToken.symbol} = {rate.toFixed(8)} {toToken.symbol}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-[var(--text-secondary)]">Inverse Rate</span>
            <div className="text-white">
              1 {toToken.symbol} = {inverseRate.toFixed(8)} {fromToken.symbol}
            </div>
          </div>
        </div>
      </div>

      {/* Token Selection Modal */}
      {(showFromSelect || showToSelect) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden" style={{ background: 'var(--bg-card)' }}>
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white">Select Token</span>
                <button
                  onClick={() => { setShowFromSelect(false); setShowToSelect(false); }}
                  className="text-[var(--text-muted)] hover:text-white text-xl"
                >
                  &times;
                </button>
              </div>
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder="Search by name or symbol..."
                className="w-full px-4 py-2.5 rounded-lg text-sm border border-[var(--border)] text-white outline-none"
                style={{ background: 'var(--bg-secondary)' }}
                autoFocus
              />
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredTokens.map(token => (
                <button
                  key={token.id}
                  onClick={() => {
                    if (showFromSelect) {
                      setFromToken(token);
                      setShowFromSelect(false);
                    } else {
                      setToToken(token);
                      setShowToSelect(false);
                    }
                    handleFromAmountChange(fromAmount);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <img src={token.image} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{token.symbol}</div>
                    <div className="text-xs text-[var(--text-muted)]">{token.name}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-sm text-white">${formatPrice(token.price)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
