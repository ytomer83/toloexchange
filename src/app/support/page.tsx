'use client';

import { useState } from 'react';
import { MessageSquare, Mail, FileText, Shield, Wallet, RefreshCw, Key, HelpCircle, ChevronDown, ChevronUp, Search, ExternalLink } from 'lucide-react';

const faqs = [
  {
    category: 'Getting Started',
    items: [
      { q: 'How do I create an account?', a: 'Click "Sign Up" on the top right corner, enter your email address and create a strong password. Then complete the KYC verification to unlock all features.' },
      { q: 'What documents do I need for KYC?', a: 'You will need a government-issued photo ID (passport, national ID, or driver\'s license) and a proof of residential address (utility bill, bank statement, or government letter dated within the last 3 months).' },
      { q: 'How long does verification take?', a: 'Most verifications are completed within 15 minutes using our automated system. In some cases, manual review may take up to 24 hours.' },
    ],
  },
  {
    category: 'Deposits & Withdrawals',
    items: [
      { q: 'How do I deposit crypto?', a: 'Go to your Wallet page, select the asset you want to deposit, choose the network, and copy the deposit address. Send your funds to this address. Make sure to select the correct network.' },
      { q: 'Why hasn\'t my deposit arrived?', a: 'Deposits require network confirmations before being credited. Bitcoin requires 2 confirmations, Ethereum requires 12. Check the blockchain explorer for the status of your transaction.' },
      { q: 'What are the swap fees?', a: 'TOLO charges 0% fees on all swaps — completely free, on every currency. Network gas fees may apply depending on the blockchain.' },
    ],
  },
  {
    category: 'Trading',
    items: [
      { q: 'What order types are available?', a: 'We support Limit orders, Market orders, and Stop-Limit orders for spot trading. Each order type serves a different purpose depending on your trading strategy.' },
      { q: 'Are there any hidden fees?', a: 'No. TOLO charges 0% fees on every swap. There are no hidden costs, no spreads, and no commissions — what you see is what you get.' },
      { q: 'How does the swap feature work?', a: 'The swap feature allows you to instantly exchange one token for another at the best available rate. Simply select the tokens you want to swap, enter the amount, and confirm.' },
    ],
  },
  {
    category: 'Security',
    items: [
      { q: 'How do I enable 2FA?', a: 'Go to Security Settings in your account, select "Enable 2FA", download a compatible authenticator app (Google Authenticator or Authy), scan the QR code, and enter the verification code.' },
      { q: 'How are my funds protected?', a: 'We store 95% of all assets in multi-signature cold wallets. Our infrastructure is SOC 2 Type II certified. We also employ real-time monitoring, DDoS protection, and regular security audits.' },
      { q: 'What should I do if my account is compromised?', a: 'Immediately contact support at support@toloexchange.biz. We will freeze your account to prevent unauthorized access. Then change your password and reset your 2FA from a secure device.' },
    ],
  },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
          <p className="text-[var(--text-secondary)] mb-6">How can we help you today?</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm border border-[var(--border)] text-white outline-none focus:border-[var(--accent)]"
              style={{ background: 'var(--bg-secondary)' }}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Wallet, label: 'Deposits & Withdrawals', href: '#deposits' },
            { icon: RefreshCw, label: 'Trading & Swaps', href: '#trading' },
            { icon: Key, label: 'Account & Security', href: '#security' },
            { icon: Shield, label: 'KYC Verification', href: '#kyc' },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} className="glass-card rounded-xl p-5 text-center hover-glow transition-all group">
              <Icon className="w-8 h-8 text-[var(--accent)] mx-auto mb-3" />
              <span className="text-sm text-[var(--text-secondary)] group-hover:text-white transition-colors">{label}</span>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredFaqs.map((cat) => (
                <div key={cat.category}>
                  <h3 className="text-sm font-semibold text-[var(--accent)] mb-3">{cat.category}</h3>
                  <div className="space-y-2">
                    {cat.items.map((item) => (
                      <div key={item.q} className="glass-card rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)}
                          className="w-full flex items-center justify-between px-4 py-3 text-left"
                        >
                          <span className="text-sm font-medium text-white pr-4">{item.q}</span>
                          {openFaq === item.q ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />}
                        </button>
                        {openFaq === item.q && (
                          <div className="px-4 pb-3 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-3">
                            {item.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Contact Us</h2>
            <div className="glass-card rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-[var(--border)] text-white outline-none focus:border-[var(--accent)]"
                    style={{ background: 'var(--bg-secondary)' }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Subject</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-[var(--border)] text-white outline-none focus:border-[var(--accent)]"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <option value="">Select a topic</option>
                    <option value="account">Account Issue</option>
                    <option value="deposit">Deposit Problem</option>
                    <option value="withdrawal">Withdrawal Problem</option>
                    <option value="trading">Trading Issue</option>
                    <option value="kyc">KYC Verification</option>
                    <option value="security">Security Concern</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-1.5 block">Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-[var(--border)] text-white outline-none focus:border-[var(--accent)] resize-none"
                    style={{ background: 'var(--bg-secondary)' }}
                  />
                </div>
                <button
                  className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'var(--accent, #2f8af5)' }}
                >
                  Send Message
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-[var(--border)] space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[var(--accent)]" />
                  <div className="text-sm">
                    <div className="text-[var(--text-muted)]">Email</div>
                    <div className="text-white">support@toloexchange.biz</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
                  <div className="text-sm">
                    <div className="text-[var(--text-muted)]">Live Chat</div>
                    <div className="text-white">Available 24/7</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
