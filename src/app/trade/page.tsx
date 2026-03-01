'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import TradingChart from '@/components/TradingChart';
import OrderBook from '@/components/OrderBook';
import { POPULAR_PAIRS, formatPrice } from '@/lib/api';
import { Search, Star, ChevronDown } from 'lucide-react';

function TradeContent() {
  const searchParams = useSearchParams();
  const pairParam = searchParams.get('pair') || 'BTC_USDT';
  const [base, quote] = pairParam.split('_');

  const [orderType, setOrderType] = useState<'limit' | 'market' | 'stop-limit'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [slider, setSlider] = useState(0);
  const [pairDropdown, setPairDropdown] = useState(false);
  const [pairSearch, setPairSearch] = useState('');
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  const pairId = POPULAR_PAIRS.find(p => p.base === base)?.id || 'bitcoin';

  useEffect(() => {
    async function fetchPrice() {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${pairId}&vs_currencies=usd&include_24hr_change=true`
        );
        if (res.ok) {
          const data = await res.json();
          if (data[pairId]) {
            setCurrentPrice(data[pairId].usd);
            setPriceChange(data[pairId].usd_24h_change || 0);
            if (!price) setPrice(data[pairId].usd.toString());
          }
        }
      } catch {
        setCurrentPrice(67432.12);
      }
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, [pairId]);

  const total = price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(2) : '0.00';

  // Recent trades
  const recentTrades = Array.from({ length: 20 }, (_, i) => {
    const isBuy = Math.random() > 0.5;
    const tradePrice = currentPrice * (0.999 + Math.random() * 0.002);
    const tradeAmount = (Math.random() * 0.5).toFixed(4);
    const time = new Date(Date.now() - i * 3000).toLocaleTimeString();
    return { isBuy, price: tradePrice, amount: tradeAmount, time };
  });

  const filteredPairs = POPULAR_PAIRS.filter(p =>
    p.base.toLowerCase().includes(pairSearch.toLowerCase()) ||
    p.quote.toLowerCase().includes(pairSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Pair Info Bar */}
      <div className="border-b border-[var(--border)] px-4 py-3" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[1440px] mx-auto flex items-center gap-3 sm:gap-6 overflow-x-auto mobile-hide-scrollbar">
          <div className="relative">
            <button
              onClick={() => setPairDropdown(!pairDropdown)}
              className="flex items-center gap-2 text-lg font-bold text-white hover:text-[var(--accent)] transition-colors"
            >
              {base}/{quote} <ChevronDown className="w-4 h-4" />
            </button>
            {pairDropdown && (
              <div className="absolute top-full left-0 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--border)] z-50 shadow-2xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="p-3 border-b border-[var(--border)]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="Search pairs..."
                      value={pairSearch}
                      onChange={(e) => setPairSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg text-xs border border-[var(--border)] text-white outline-none"
                      style={{ background: 'var(--bg-tertiary)' }}
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredPairs.map((pair) => (
                    <a
                      key={pair.base}
                      href={`/trade?pair=${pair.base}_${pair.quote}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span className="text-white font-medium">{pair.base}/{pair.quote}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:gap-6 text-sm">
            <div>
              <span className={`text-lg font-bold ${priceChange >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                ${formatPrice(currentPrice)}
              </span>
            </div>
            <div>
              <div className="text-[var(--text-muted)] text-xs">24h Change</div>
              <div className={`font-medium ${priceChange >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[var(--text-muted)] text-xs">24h High</div>
              <div className="text-white font-medium">${formatPrice(currentPrice * 1.02)}</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-[var(--text-muted)] text-xs">24h Low</div>
              <div className="text-white font-medium">${formatPrice(currentPrice * 0.98)}</div>
            </div>
            <div className="hidden md:block">
              <div className="text-[var(--text-muted)] text-xs">24h Volume</div>
              <div className="text-white font-medium">$1.42B</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trading Area */}
      <div className="max-w-[1440px] mx-auto px-2 lg:px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_280px_320px] gap-2">
          {/* Chart */}
          <div className="glass-card rounded-xl overflow-hidden min-h-[400px] lg:min-h-[500px]">
            {currentPrice > 0 && <TradingChart symbol={`${base}${quote}`} basePrice={currentPrice} />}
          </div>

          {/* Order Book */}
          <div className="glass-card rounded-xl overflow-hidden min-h-[400px] lg:min-h-[500px]">
            {currentPrice > 0 && <OrderBook basePrice={currentPrice} />}
          </div>

          {/* Order Form */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="p-4">
              {/* Buy/Sell tabs */}
              <div className="flex rounded-lg overflow-hidden mb-4" style={{ background: 'var(--bg-tertiary)' }}>
                <button
                  onClick={() => setSide('buy')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    side === 'buy' ? 'bg-[var(--green)] text-white' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSide('sell')}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    side === 'sell' ? 'bg-[var(--red)] text-white' : 'text-[var(--text-secondary)]'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Order type tabs */}
              <div className="flex gap-2 sm:gap-4 mb-4 border-b border-[var(--border)] overflow-x-auto">
                {(['limit', 'market', 'stop-limit'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`pb-2 text-xs font-medium capitalize transition-colors ${
                      orderType === type ? 'text-white tab-active' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {type === 'stop-limit' ? 'Stop-Limit' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Available balance */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[var(--text-muted)]">Available</span>
                <span className="text-xs text-white">
                  {side === 'buy' ? '10,000.00 USDT' : `0.5 ${base}`}
                </span>
              </div>

              {/* Price input */}
              {orderType !== 'market' && (
                <div className="mb-3">
                  <div className="flex items-center rounded-lg border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-xs text-[var(--text-muted)] pl-3">Price</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="flex-1 bg-transparent text-right text-sm text-white py-2.5 px-3 outline-none"
                      placeholder="0.00"
                    />
                    <span className="text-xs text-[var(--text-muted)] pr-3">{quote}</span>
                  </div>
                </div>
              )}

              {/* Amount input */}
              <div className="mb-3">
                <div className="flex items-center rounded-lg border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs text-[var(--text-muted)] pl-3">Amount</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-transparent text-right text-sm text-white py-2.5 px-3 outline-none"
                    placeholder="0.00"
                  />
                  <span className="text-xs text-[var(--text-muted)] pr-3">{base}</span>
                </div>
              </div>

              {/* Slider */}
              <div className="mb-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={slider}
                  onChange={(e) => setSlider(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
                  {['0%', '25%', '50%', '75%', '100%'].map(p => (
                    <span key={p} className="cursor-pointer hover:text-white">{p}</span>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mb-4">
                <div className="flex items-center rounded-lg border border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs text-[var(--text-muted)] pl-3">Total</span>
                  <input
                    type="text"
                    value={total}
                    readOnly
                    className="flex-1 bg-transparent text-right text-sm text-white py-2.5 px-3 outline-none"
                  />
                  <span className="text-xs text-[var(--text-muted)] pr-3">{quote}</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                className={`w-full py-3 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 ${
                  side === 'buy' ? 'bg-[var(--green)]' : 'bg-[var(--red)]'
                }`}
              >
                {side === 'buy' ? `Buy ${base}` : `Sell ${base}`}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Trades & Open Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
          {/* Recent Trades */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <span className="text-sm font-medium text-white">Recent Trades</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[var(--text-muted)] border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                    <td className="py-2 pl-4">Price ({quote})</td>
                    <td className="py-2 text-right">Amount ({base})</td>
                    <td className="py-2 pr-4 text-right">Time</td>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map((trade, i) => (
                    <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)]">
                      <td className={`py-1.5 pl-4 ${trade.isBuy ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                        {formatPrice(trade.price)}
                      </td>
                      <td className="py-1.5 text-right text-[var(--text-primary)]">{trade.amount}</td>
                      <td className="py-1.5 pr-4 text-right text-[var(--text-muted)]">{trade.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Open Orders */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-4">
              <span className="text-sm font-medium text-white tab-active pb-1">Open Orders (0)</span>
              <span className="text-sm text-[var(--text-muted)] pb-1 cursor-pointer hover:text-white">Order History</span>
              <span className="text-sm text-[var(--text-muted)] pb-1 cursor-pointer hover:text-white">Trade History</span>
            </div>
            <div className="p-8 text-center">
              <p className="text-sm text-[var(--text-muted)]">No open orders</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Your open orders will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-[var(--text-secondary)]">Loading...</div></div>}>
      <TradeContent />
    </Suspense>
  );
}
