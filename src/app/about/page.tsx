import { Shield, Globe, Building, MapPin, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(47, 138, 245, 0.15) 0%, transparent 60%)' }} />
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            About TOLO
          </h1>
          <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
            TOLO is a digital currency exchange platform operated by Polarbit Solutions Limited,
            a FINTRAC-registered Money Services Business based in Vancouver, Canada.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[900px] mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Our Mission</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                We believe swapping digital assets should be simple, transparent, and accessible.
                Our platform offers a clean interface where you connect your wallet and swap tokens
                with 0% fees, completely free, no hidden costs, no surprises.
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Operating as a registered MSB under FINTRAC, we combine regulatory compliance
                with a seamless user experience across multiple blockchain networks.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'FINTRAC MSB', value: 'Registered' },
                { icon: Globe, label: 'Chains', value: 'Multi-Chain' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass-card rounded-xl p-5 text-center">
                  <Icon className="w-7 h-7 text-[var(--accent)] mx-auto mb-3" />
                  <div className="text-lg font-bold text-[var(--text-primary)]">{value}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-10">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Security First', desc: 'Industry-leading security practices protect your assets. We never hold your private keys, you remain in control of your wallet at all times.' },
              { title: 'Transparency', desc: '0% fees on every swap. No hidden costs, no variable spreads. What you see is exactly what you get.' },
              { title: 'Simplicity', desc: 'Connect your wallet, pick your tokens, and swap. Our interface is designed to make digital asset exchange effortless.' },
            ].map(({ title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-[900px] mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] text-center mb-10">Company Information</h2>
          <div className="max-w-xl mx-auto glass-card rounded-2xl p-8">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Building className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">Polarbit Solutions Limited</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">FINTRAC Registered Money Services Business</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">Registered Address</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">700-838 W Hastings Street, Vancouver, BC V6C 0A6, Canada</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">Contact</div>
                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">support@toloexchange.biz</div>
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-1">FINTRAC MSB No.</div>
                  <div className="text-sm font-mono font-medium text-[var(--text-primary)]">C10001398</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-1">Incorporation No.</div>
                  <div className="text-sm font-mono font-medium text-[var(--text-primary)]">BC1547199</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
