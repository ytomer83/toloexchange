import { Shield, Users, Globe, Award, MapPin, Mail, Phone, Building } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 180, 216, 0.2) 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About <span className="gradient-text">TOLO</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            TOLO is a regulated cryptocurrency exchange operated by Simha Fintech Sp. z o.o.,
            a VASP-licensed company based in Poland. We&apos;re building the future of digital asset trading.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We believe that everyone deserves access to the digital economy. Our mission is to provide
                a secure, regulated, and user-friendly platform for trading cryptocurrencies.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Operating under full EU regulatory compliance, we combine institutional-grade security
                with an intuitive interface that makes crypto trading accessible to both beginners and professionals.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'VASP Licensed', value: 'Fully Regulated' },
                { icon: Users, label: 'Users', value: '1.2M+' },
                { icon: Globe, label: 'Countries', value: '180+' },
                { icon: Award, label: 'Assets', value: '200+' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass-card rounded-xl p-5 text-center">
                  <Icon className="w-8 h-8 text-[var(--accent)] mx-auto mb-3" />
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Security First', desc: 'We store 95% of assets in cold wallets, employ multi-signature technology, and undergo regular security audits by third-party firms.' },
              { title: 'Transparency', desc: 'We operate with full regulatory compliance, maintain clear fee structures, and provide regular proof of reserves reports.' },
              { title: 'Innovation', desc: 'We continuously improve our platform with cutting-edge technology, including our high-performance matching engine and advanced trading tools.' },
            ].map(({ title, desc }) => (
              <div key={title} className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16" style={{ background: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Company Information</h2>
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <Building className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">Simha Fintech Sp. z o.o.</div>
                  <div className="text-sm text-[var(--text-secondary)] mt-0.5">A company registered in Poland under the National Court Register</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">Registered Address</div>
                  <div className="text-sm text-[var(--text-secondary)] mt-0.5">ul. Juliana Tuwima 48/11, 90-021 Łódź, Poland</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[var(--accent)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-white">Contact</div>
                  <div className="text-sm text-[var(--text-secondary)] mt-0.5">
                    info@simhafintech.com<br />support@simhafintech.com
                  </div>
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-5 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-1">KRS</div>
                  <div className="text-sm font-medium text-white">0001138948</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-1">NIP</div>
                  <div className="text-sm font-medium text-white">7252349639</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] mb-1">REGON</div>
                  <div className="text-sm font-medium text-white">540205675</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-16" id="careers">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Join Our Team</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-xl mx-auto">
            We&apos;re always looking for talented people who are passionate about crypto and fintech.
            Check out our open positions or send us your CV.
          </p>
          <a
            href="mailto:info@simhafintech.com"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
          >
            <Mail className="w-4 h-4" /> Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
