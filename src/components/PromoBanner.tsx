'use client';

import Link from 'next/link';
import { Gift, ArrowRight, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export function PromoStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #00b4d8, #7c3aed, #c026d3, #00b4d8)', backgroundSize: '200% 100%', animation: 'gradientShift 6s ease infinite' }}>
      <style jsx>{`@keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }`}</style>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-center gap-3">
        <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
        <p className="text-sm font-semibold text-white text-center">
          Limited Time: Deposit $100 and get a <span className="text-yellow-300">$500 Trading Bonus!</span>
        </p>
        <Link
          href="/wallet"
          className="shrink-0 px-3 py-1 text-xs font-bold text-black bg-yellow-300 rounded-full hover:bg-yellow-200 transition-colors"
        >
          Claim Now
        </Link>
        <button onClick={() => setVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function PromoCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a0a2e 50%, #0d1b3e 100%)' }}>
      {/* Animated glow circles */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #c026d3, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #00b4d8, transparent)' }} />

      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-yellow-300 mb-4" style={{ background: 'rgba(250, 204, 21, 0.15)', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
            <Gift className="w-3.5 h-3.5" />
            LIMITED TIME OFFER
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Deposit $100, Get{' '}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #facc15, #f97316)' }}>
              $500 Bonus
            </span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4 max-w-md">
            New users who deposit at least $100 in any cryptocurrency will receive a $500 trading bonus credited instantly. Connect your wallet and start trading today.
          </p>
          <ul className="text-xs text-[var(--text-secondary)] space-y-1.5 mb-5">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
              Deposit $100+ in any supported crypto
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
              $500 bonus credited to your trading balance instantly
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
              Trade with 5x more capital from day one
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
              Withdraw profits anytime after meeting trading volume
            </li>
          </ul>
          <Link
            href="/wallet"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-black rounded-xl transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #facc15, #f97316)' }}
          >
            Deposit & Claim Bonus <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Bonus visual */}
        <div className="shrink-0">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1), rgba(249, 115, 22, 0.1))', border: '2px solid rgba(250, 204, 21, 0.2)' }}>
            <div className="absolute inset-3 rounded-full" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.05), rgba(249, 115, 22, 0.05))', border: '1px solid rgba(250, 204, 21, 0.1)' }} />
            <div className="text-center relative z-10">
              <div className="text-sm font-medium text-yellow-400 mb-1">GET UP TO</div>
              <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #facc15, #f97316)' }}>
                $500
              </div>
              <div className="text-xs font-bold text-yellow-400 mt-1">TRADING BONUS</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletPromoCard() {
  return (
    <div className="rounded-xl p-5 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.08), rgba(249, 115, 22, 0.08))', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(249, 115, 22, 0.2))' }}>
        <Gift className="w-6 h-6 text-yellow-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-white">Deposit $100, Get $500 Bonus!</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Connect your wallet and deposit to claim your bonus instantly.</p>
      </div>
      <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 animate-pulse" />
    </div>
  );
}
