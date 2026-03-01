import { Info } from 'lucide-react';

export default function FeesPage() {
  const spotFees = [
    { tier: 'Regular', volume: '< $50,000', maker: '0.10%', taker: '0.10%' },
    { tier: 'VIP 1', volume: '$50,000 - $100,000', maker: '0.09%', taker: '0.10%' },
    { tier: 'VIP 2', volume: '$100,000 - $500,000', maker: '0.08%', taker: '0.09%' },
    { tier: 'VIP 3', volume: '$500,000 - $1,000,000', maker: '0.06%', taker: '0.08%' },
    { tier: 'VIP 4', volume: '$1,000,000 - $5,000,000', maker: '0.04%', taker: '0.06%' },
    { tier: 'VIP 5', volume: '$5,000,000 - $10,000,000', maker: '0.02%', taker: '0.04%' },
    { tier: 'VIP 6', volume: '> $10,000,000', maker: '0.00%', taker: '0.02%' },
  ];

  const withdrawalFees = [
    { asset: 'BTC', network: 'Bitcoin', fee: '0.0005 BTC', min: '0.001 BTC' },
    { asset: 'ETH', network: 'ERC-20', fee: '0.005 ETH', min: '0.01 ETH' },
    { asset: 'ETH', network: 'Arbitrum One', fee: '0.0001 ETH', min: '0.001 ETH' },
    { asset: 'USDT', network: 'ERC-20', fee: '10 USDT', min: '20 USDT' },
    { asset: 'USDT', network: 'TRC-20', fee: '1 USDT', min: '10 USDT' },
    { asset: 'USDT', network: 'BEP-20', fee: '0.8 USDT', min: '10 USDT' },
    { asset: 'USDC', network: 'ERC-20', fee: '10 USDC', min: '20 USDC' },
    { asset: 'SOL', network: 'Solana', fee: '0.01 SOL', min: '0.1 SOL' },
    { asset: 'BNB', network: 'BEP-20', fee: '0.0005 BNB', min: '0.01 BNB' },
    { asset: 'XRP', network: 'XRP Ledger', fee: '0.25 XRP', min: '1 XRP' },
    { asset: 'ADA', network: 'Cardano', fee: '1 ADA', min: '5 ADA' },
    { asset: 'DOGE', network: 'Dogecoin', fee: '5 DOGE', min: '20 DOGE' },
  ];

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Fee Schedule</h1>
          <p className="text-[var(--text-secondary)]">Transparent and competitive fees for all traders</p>
        </div>

        {/* Spot Trading Fees */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Spot Trading Fees</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[var(--text-muted)] border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                  <th className="text-left py-3 pl-4">Tier</th>
                  <th className="text-left py-3">30-Day Volume (USD)</th>
                  <th className="text-right py-3">Maker Fee</th>
                  <th className="text-right py-3 pr-4">Taker Fee</th>
                </tr>
              </thead>
              <tbody>
                {spotFees.map((fee, i) => (
                  <tr key={fee.tier} className={`border-b border-[var(--border)] ${i === 0 ? 'bg-[var(--bg-secondary)]' : ''}`}>
                    <td className="py-3 pl-4 text-sm">
                      <span className={i === 0 ? 'text-white font-medium' : 'text-[var(--text-secondary)]'}>{fee.tier}</span>
                    </td>
                    <td className="py-3 text-sm text-[var(--text-secondary)]">{fee.volume}</td>
                    <td className="py-3 text-right text-sm text-[var(--green)] font-medium">{fee.maker}</td>
                    <td className="py-3 pr-4 text-right text-sm text-white font-medium">{fee.taker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 mt-3 text-xs text-[var(--text-muted)]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Maker orders add liquidity to the order book. Taker orders remove liquidity. Your fee tier is determined by your 30-day trailing trading volume.</p>
          </div>
        </div>

        {/* Swap Fees */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Swap Fees</h2>
          <div className="glass-card rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">0.1%</div>
                <div className="text-sm text-[var(--text-secondary)]">Flat swap fee on all instant swaps. No hidden markups on exchange rates.</div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Minimum swap</span>
                  <span className="text-white">$1.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Maximum swap</span>
                  <span className="text-white">$1,000,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-muted)]">Network fee</span>
                  <span className="text-white">Included</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Fees */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Withdrawal Fees</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[var(--text-muted)] border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                  <th className="text-left py-3 pl-4">Asset</th>
                  <th className="text-left py-3">Network</th>
                  <th className="text-right py-3">Withdrawal Fee</th>
                  <th className="text-right py-3 pr-4">Minimum Withdrawal</th>
                </tr>
              </thead>
              <tbody>
                {withdrawalFees.map((fee, i) => (
                  <tr key={`${fee.asset}-${fee.network}`} className="border-b border-[var(--border)]">
                    <td className="py-3 pl-4 text-sm font-medium text-white">{fee.asset}</td>
                    <td className="py-3 text-sm text-[var(--text-secondary)]">{fee.network}</td>
                    <td className="py-3 text-right text-sm text-white">{fee.fee}</td>
                    <td className="py-3 pr-4 text-right text-sm text-[var(--text-secondary)]">{fee.min}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 mt-3 text-xs text-[var(--text-muted)]">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Deposits are free for all assets and networks. Withdrawal fees are subject to change based on network conditions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
