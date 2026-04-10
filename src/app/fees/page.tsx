import { Info } from 'lucide-react';

export default function FeesPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[900px] mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Fee Schedule</h1>
          <p className="text-sm text-[var(--text-secondary)]">Free swaps on every currency — zero fees, always</p>
        </div>

        {/* Swap Fee */}
        <div className="mb-12">
          <div className="glass-card rounded-2xl p-8 text-center">
            <div className="text-6xl font-bold text-[var(--green)] mb-2">0%</div>
            <div className="text-lg text-[var(--text-secondary)] mb-6">Free swaps on all currencies</div>
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Swap fee</span>
                <span className="text-[var(--green)] font-medium">0% — completely free</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Hidden fees</span>
                <span className="text-[var(--green)] font-medium">None</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-[var(--border)]">
                <span className="text-[var(--text-muted)]">Minimum swap</span>
                <span className="text-white font-medium">$1.00</span>
              </div>
              <div className="flex justify-between text-sm py-2">
                <span className="text-[var(--text-muted)]">Maximum swap</span>
                <span className="text-white font-medium">No limit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Example */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Example</h2>
          <div className="glass-card rounded-xl p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">You swap</span>
                <span className="text-white font-medium">1,000 USDC</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Fee</span>
                <span className="text-[var(--green)] font-medium">FREE (0%)</span>
              </div>
              <div className="border-t border-[var(--border)] pt-3 flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">You receive</span>
                <span className="text-white font-semibold">1,000.00 USDT</span>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-3 text-xs text-[var(--text-muted)]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Rates are determined at the time of swap. TOLO charges 0% fees on all swaps. Network gas fees may apply depending on the blockchain.</p>
          </div>
        </div>

        {/* Supported tokens note */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-semibold text-white mb-2">Supported Tokens</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            TOLO supports swapping between 20+ digital assets including USDC, USDT, ETH, BTC, SOL, BNB, DAI, XRP, MATIC, AVAX, DOT, LINK, ADA, DOGE, UNI, AAVE, ARB, OP, LTC, SHIB, and more. All tokens swap with 0% fees.
          </p>
        </div>
      </div>
    </div>
  );
}
