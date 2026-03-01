import { Code, Key, Zap, Lock, FileText, ExternalLink } from 'lucide-react';

export default function APIDocsPage() {
  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
          <p className="text-[var(--text-secondary)]">Build powerful trading applications with the TOLO API</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="glass-card rounded-xl p-4 sticky top-24">
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Overview</h3>
              <div className="space-y-1.5">
                {['Introduction', 'Authentication', 'Rate Limits', 'Errors'].map(item => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-sm text-[var(--text-secondary)] hover:text-white transition-colors py-1">
                    {item}
                  </a>
                ))}
              </div>
              <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Endpoints</h3>
              <div className="space-y-1.5">
                {['Market Data', 'Trading', 'Account', 'Wallet', 'WebSocket'].map(item => (
                  <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="block text-sm text-[var(--text-secondary)] hover:text-white transition-colors py-1">
                    {item}
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Introduction */}
            <section id="introduction">
              <h2 className="text-xl font-bold text-white mb-4">Introduction</h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  The TOLO API provides programmatic access to our exchange. Use it to build trading bots, integrate market data, manage your portfolio, and more.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: Zap, title: 'RESTful API', desc: 'Standard REST endpoints for all operations' },
                    { icon: Code, title: 'WebSocket', desc: 'Real-time data streams for market data' },
                    { icon: Lock, title: 'Secure', desc: 'HMAC-SHA256 signed requests' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                      <Icon className="w-5 h-5 text-[var(--accent)] mb-2" />
                      <div className="text-sm font-medium text-white">{title}</div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">{desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 mt-4">
                <h3 className="text-sm font-semibold text-white mb-3">Base URL</h3>
                <code className="block px-4 py-3 rounded-lg text-sm font-mono" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
                  https://api.tolo.exchange/v1
                </code>
              </div>
            </section>

            {/* Authentication */}
            <section id="authentication">
              <h2 className="text-xl font-bold text-white mb-4">Authentication</h2>
              <div className="glass-card rounded-xl p-6">
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  All private endpoints require authentication using API keys. Generate your keys in Account Settings.
                </p>
                <h3 className="text-sm font-semibold text-white mb-3">Request Headers</h3>
                <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <pre className="p-4 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`X-TOLO-APIKEY: your-api-key
X-TOLO-SIGNATURE: hmac-sha256-signature
X-TOLO-TIMESTAMP: 1234567890000`}</pre>
                </div>
                <h3 className="text-sm font-semibold text-white mt-4 mb-3">Signature Generation</h3>
                <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <pre className="p-4 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`const crypto = require('crypto');

const timestamp = Date.now();
const method = 'GET';
const path = '/v1/account/balances';
const body = '';

const message = timestamp + method + path + body;
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update(message)
  .digest('hex');`}</pre>
                </div>
              </div>
            </section>

            {/* Market Data */}
            <section id="market-data">
              <h2 className="text-xl font-bold text-white mb-4">Market Data</h2>

              {/* Ticker */}
              <div className="glass-card rounded-xl p-6 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-[var(--green)] text-black">GET</span>
                  <code className="text-sm font-mono text-white">/v1/market/ticker</code>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Get 24hr ticker for a symbol or all symbols.</p>

                <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Parameters</h4>
                <table className="w-full text-xs mb-4">
                  <thead>
                    <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Required</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-secondary)]">
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-2 font-mono text-white">symbol</td>
                      <td className="py-2">string</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Trading pair (e.g., BTC_USDT)</td>
                    </tr>
                  </tbody>
                </table>

                <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Response</h4>
                <div className="rounded-lg overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <pre className="p-4 text-xs font-mono text-[var(--text-secondary)] overflow-x-auto">{`{
  "symbol": "BTC_USDT",
  "last": "67432.12",
  "bid": "67430.00",
  "ask": "67435.00",
  "high": "68100.00",
  "low": "66200.00",
  "volume": "1542.35",
  "change": "2.34",
  "timestamp": 1234567890000
}`}</pre>
                </div>
              </div>

              {/* Order Book */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-[var(--green)] text-black">GET</span>
                  <code className="text-sm font-mono text-white">/v1/market/orderbook</code>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mb-4">Get order book depth for a symbol.</p>

                <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Parameters</h4>
                <table className="w-full text-xs mb-4">
                  <thead>
                    <tr className="text-[var(--text-muted)] border-b border-[var(--border)]">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Required</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-secondary)]">
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-2 font-mono text-white">symbol</td>
                      <td className="py-2">string</td>
                      <td className="py-2">Yes</td>
                      <td className="py-2">Trading pair</td>
                    </tr>
                    <tr className="border-b border-[var(--border)]">
                      <td className="py-2 font-mono text-white">limit</td>
                      <td className="py-2">integer</td>
                      <td className="py-2">No</td>
                      <td className="py-2">Depth (5, 10, 20, 50). Default: 20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits">
              <h2 className="text-xl font-bold text-white mb-4">Rate Limits</h2>
              <div className="glass-card rounded-xl p-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[var(--text-muted)] border-b border-[var(--border)] text-xs">
                      <th className="text-left py-2">Endpoint Type</th>
                      <th className="text-right py-2">Rate Limit</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--text-secondary)]">
                    <tr className="border-b border-[var(--border)]"><td className="py-2">Public endpoints</td><td className="py-2 text-right text-white">20 requests/second</td></tr>
                    <tr className="border-b border-[var(--border)]"><td className="py-2">Private endpoints</td><td className="py-2 text-right text-white">10 requests/second</td></tr>
                    <tr className="border-b border-[var(--border)]"><td className="py-2">Order placement</td><td className="py-2 text-right text-white">5 requests/second</td></tr>
                    <tr><td className="py-2">WebSocket connections</td><td className="py-2 text-right text-white">5 per user</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
