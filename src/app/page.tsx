import Link from 'next/link';
import { fetchTopCryptos, formatPrice, formatVolume, formatMarketCap } from '@/lib/api';
import SparklineChart from '@/components/SparklineChart';
import { PromoCard } from '@/components/PromoBanner';
import { ArrowRight, Shield, Zap, BarChart3, Wallet, RefreshCw, Globe, Lock, Headphones, TrendingUp } from 'lucide-react';

export const revalidate = 30;

export default async function HomePage() {
  const cryptos = await fetchTopCryptos(20);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 180, 216, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(192, 38, 211, 0.1) 0%, transparent 50%)' }} />
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--border)] text-xs text-[var(--text-secondary)] mb-6" style={{ background: 'var(--bg-secondary)' }}>
              <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
              VASP Licensed Exchange
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Trade Crypto with{' '}
              <span className="gradient-text">Confidence</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              Buy, sell, and swap 200+ cryptocurrencies on a regulated, secure platform. Low fees, deep liquidity, and 24/7 support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-8 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/markets"
                className="px-8 py-3.5 text-base font-semibold text-white rounded-xl border border-[var(--border)] hover:border-[var(--text-secondary)] transition-all"
              >
                View Markets
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-8 border-t border-[var(--border)]">
              {[
                { label: '24h Volume', value: '$2.8B+' },
                { label: 'Supported Assets', value: '200+' },
                { label: 'Registered Users', value: '1.2M+' },
                { label: 'Countries', value: '180+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <PromoCard />
        </div>
      </section>

      {/* Live Prices Table */}
      <section className="py-16" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Market Overview</h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Live cryptocurrency prices</p>
            </div>
            <Link href="/markets" className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1">
              View All Markets <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[var(--text-muted)] border-b border-[var(--border)]">
                  <th className="text-left pb-3 pl-4">#</th>
                  <th className="text-left pb-3">Name</th>
                  <th className="text-right pb-3">Price</th>
                  <th className="text-right pb-3">24h Change</th>
                  <th className="text-right pb-3 hidden md:table-cell">Market Cap</th>
                  <th className="text-right pb-3 hidden lg:table-cell">Volume (24h)</th>
                  <th className="text-right pb-3 hidden lg:table-cell">Last 7 Days</th>
                  <th className="text-right pb-3 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {cryptos.slice(0, 10).map((crypto) => (
                  <tr key={crypto.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors group">
                    <td className="py-4 pl-4 text-sm text-[var(--text-secondary)]">{crypto.market_cap_rank}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <div className="text-sm font-medium text-white">{crypto.name}</div>
                          <div className="text-xs text-[var(--text-muted)]">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-right text-sm font-medium text-white">${formatPrice(crypto.current_price)}</td>
                    <td className={`py-4 text-right text-sm font-medium ${crypto.price_change_percentage_24h >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                      {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}%
                    </td>
                    <td className="py-4 text-right text-sm text-[var(--text-secondary)] hidden md:table-cell">
                      {formatMarketCap(crypto.market_cap)}
                    </td>
                    <td className="py-4 text-right text-sm text-[var(--text-secondary)] hidden lg:table-cell">
                      {formatVolume(crypto.total_volume)}
                    </td>
                    <td className="py-4 text-right hidden lg:table-cell">
                      {crypto.sparkline_in_7d && (
                        <SparklineChart
                          data={crypto.sparkline_in_7d.price}
                          positive={crypto.price_change_percentage_24h >= 0}
                        />
                      )}
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <Link
                        href={`/trade?pair=${crypto.symbol.toUpperCase()}_USDT`}
                        className="px-3 py-1.5 text-xs font-medium text-[var(--accent)] border border-[var(--accent)] rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-[var(--accent)] hover:text-black"
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Why Choose TOLO?</h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Built for traders who demand security, speed, and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Regulated & Licensed', desc: 'VASP licensed in Poland under EU regulations. Your assets are protected by institutional-grade security.' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Execute trades in milliseconds with our high-performance matching engine and deep order books.' },
              { icon: BarChart3, title: 'Advanced Trading', desc: 'Professional charts, multiple order types, and real-time market data for informed decisions.' },
              { icon: Wallet, title: 'Secure Wallets', desc: 'Multi-signature cold storage, 2FA authentication, and insurance coverage for digital assets.' },
              { icon: RefreshCw, title: 'Instant Swaps', desc: 'Swap between 200+ tokens instantly with competitive rates and minimal slippage.' },
              { icon: Globe, title: 'Global Access', desc: 'Trade from anywhere in the world with support for 30+ fiat currencies and 180+ countries.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-6 hover-glow transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(192, 38, 211, 0.2))' }}>
                  <Icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Start Trading in Minutes</h2>
            <p className="text-[var(--text-secondary)]">Three simple steps to get started</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up with your email and complete KYC verification in minutes.' },
              { step: '02', title: 'Deposit Funds', desc: 'Deposit crypto or buy with fiat using bank transfer, card, or P2P.' },
              { step: '03', title: 'Start Trading', desc: 'Trade spot markets, use instant swap, or set limit orders.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="text-5xl font-bold gradient-text mb-4">{step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Security You Can <span className="gradient-text">Trust</span>
              </h2>
              <p className="text-[var(--text-secondary)] mb-8">
                Your security is our top priority. We employ industry-leading practices to protect your assets and data.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Lock, text: '95% of funds stored in cold wallets' },
                  { icon: Shield, text: 'SOC 2 Type II certified infrastructure' },
                  { icon: Headphones, text: '24/7 dedicated customer support' },
                  { icon: TrendingUp, text: 'Real-time monitoring and threat detection' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(0, 180, 216, 0.1)' }}>
                      <Icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <span className="text-sm text-[var(--text-primary)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-1">Licensed & Regulated</h3>
                <p className="text-sm text-[var(--text-secondary)]">Operating under full regulatory compliance</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--text-secondary)]">Entity</span>
                  <span className="text-sm text-white font-medium">Simha Fintech Sp. z o.o.</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--text-secondary)]">License</span>
                  <span className="text-sm text-white font-medium">VASP (Poland)</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--text-secondary)]">KRS</span>
                  <span className="text-sm text-white font-medium">0001138948</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--text-secondary)]">NIP</span>
                  <span className="text-sm text-white font-medium">7252349639</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-[var(--text-secondary)]">REGON</span>
                  <span className="text-sm text-white font-medium">540205675</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Join millions of traders on TOLO. Create your account today and get access to 200+ cryptocurrencies.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
