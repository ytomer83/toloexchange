'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/api';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}

const defaultTickers: TickerItem[] = [
  { symbol: 'BTC', price: 67432.12, change: 2.34 },
  { symbol: 'ETH', price: 3456.78, change: 1.87 },
  { symbol: 'SOL', price: 172.34, change: 4.21 },
  { symbol: 'BNB', price: 598.45, change: -0.54 },
  { symbol: 'XRP', price: 0.5234, change: -1.23 },
  { symbol: 'ADA', price: 0.4567, change: 3.45 },
  { symbol: 'DOGE', price: 0.1234, change: 5.67 },
  { symbol: 'DOT', price: 7.23, change: -2.14 },
  { symbol: 'AVAX', price: 35.67, change: 1.92 },
  { symbol: 'MATIC', price: 0.8912, change: -0.87 },
  { symbol: 'LINK', price: 14.56, change: 3.21 },
  { symbol: 'UNI', price: 9.78, change: -1.56 },
];

export default function LiveTicker() {
  const [tickers, setTickers] = useState<TickerItem[]>(defaultTickers);

  useEffect(() => {
    async function fetchTickers() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=12&page=1'
        );
        if (res.ok) {
          const data = await res.json();
          setTickers(
            data.map((c: { symbol: string; current_price: number; price_change_percentage_24h: number }) => ({
              symbol: c.symbol.toUpperCase(),
              price: c.current_price,
              change: c.price_change_percentage_24h || 0,
            }))
          );
        }
      } catch {
        // Use defaults
      }
    }
    fetchTickers();
    const interval = setInterval(fetchTickers, 30000);
    return () => clearInterval(interval);
  }, []);

  const tickerContent = [...tickers, ...tickers];

  return (
    <div className="w-full overflow-hidden border-b border-[var(--border)]" style={{ background: 'var(--bg-card)' }}>
      <div className="flex animate-ticker" style={{ width: 'max-content' }}>
        {tickerContent.map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-2 whitespace-nowrap">
            <span className="text-xs font-medium text-[var(--text-primary)]">{t.symbol}/USD</span>
            <span className="text-xs text-[var(--text-primary)]">${formatPrice(t.price)}</span>
            <span className={`text-xs font-medium ${t.change >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {t.change >= 0 ? '+' : ''}{t.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
