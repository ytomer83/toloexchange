'use client';

import { useMemo } from 'react';
import { formatPrice } from '@/lib/api';

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

function generateOrderBook(basePrice: number): { asks: OrderBookEntry[]; bids: OrderBookEntry[] } {
  const asks: OrderBookEntry[] = [];
  const bids: OrderBookEntry[] = [];

  let askTotal = 0;
  let bidTotal = 0;

  for (let i = 0; i < 15; i++) {
    const askPrice = basePrice * (1 + (i + 1) * 0.0003 + Math.random() * 0.0002);
    const askAmount = 0.01 + Math.random() * 2;
    askTotal += askAmount;
    asks.push({ price: askPrice, amount: askAmount, total: askTotal });

    const bidPrice = basePrice * (1 - (i + 1) * 0.0003 - Math.random() * 0.0002);
    const bidAmount = 0.01 + Math.random() * 2;
    bidTotal += bidAmount;
    bids.push({ price: bidPrice, amount: bidAmount, total: bidTotal });
  }

  return { asks: asks.reverse(), bids };
}

export default function OrderBook({ basePrice }: { basePrice: number }) {
  const { asks, bids } = useMemo(() => generateOrderBook(basePrice), [basePrice]);
  const maxTotal = Math.max(asks[0]?.total || 0, bids[bids.length - 1]?.total || 0);

  return (
    <div className="h-full flex flex-col text-xs">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)]">
        <span className="font-medium text-white">Order Book</span>
        <div className="flex gap-1">
          <button className="p-1 rounded bg-[var(--bg-tertiary)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="5" rx="1" fill="#f6465d"/><rect x="1" y="8" width="12" height="5" rx="1" fill="#0ecb81"/></svg>
          </button>
          <button className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1" fill="#f6465d"/></svg>
          </button>
          <button className="p-1 rounded hover:bg-[var(--bg-tertiary)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="1" fill="#0ecb81"/></svg>
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex items-center px-3 py-1.5 text-[var(--text-muted)]" style={{ background: 'var(--bg-secondary)' }}>
        <span className="flex-1">Price (USDT)</span>
        <span className="flex-1 text-right">Amount</span>
        <span className="flex-1 text-right">Total</span>
      </div>

      {/* Asks (sells) */}
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col justify-end h-[calc(50%-20px)]">
          {asks.map((ask, i) => (
            <div key={i} className="relative flex items-center px-3 py-[3px] hover:bg-[var(--bg-tertiary)] cursor-pointer">
              <div
                className="absolute right-0 top-0 bottom-0 opacity-15"
                style={{
                  width: `${(ask.total / maxTotal) * 100}%`,
                  background: 'var(--red)',
                }}
              />
              <span className="flex-1 text-[var(--red)] relative z-10">{formatPrice(ask.price)}</span>
              <span className="flex-1 text-right text-[var(--text-primary)] relative z-10">{ask.amount.toFixed(4)}</span>
              <span className="flex-1 text-right text-[var(--text-secondary)] relative z-10">{ask.total.toFixed(4)}</span>
            </div>
          ))}
        </div>

        {/* Spread / current price */}
        <div className="flex items-center justify-center py-2 px-3 border-y border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
          <span className={`text-lg font-bold ${basePrice > 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
            ${formatPrice(basePrice)}
          </span>
          <span className="text-[var(--text-muted)] ml-2">${formatPrice(basePrice)}</span>
        </div>

        {/* Bids (buys) */}
        <div className="h-[calc(50%-20px)]">
          {bids.map((bid, i) => (
            <div key={i} className="relative flex items-center px-3 py-[3px] hover:bg-[var(--bg-tertiary)] cursor-pointer">
              <div
                className="absolute right-0 top-0 bottom-0 opacity-15"
                style={{
                  width: `${(bid.total / maxTotal) * 100}%`,
                  background: 'var(--green)',
                }}
              />
              <span className="flex-1 text-[var(--green)] relative z-10">{formatPrice(bid.price)}</span>
              <span className="flex-1 text-right text-[var(--text-primary)] relative z-10">{bid.amount.toFixed(4)}</span>
              <span className="flex-1 text-right text-[var(--text-secondary)] relative z-10">{bid.total.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
