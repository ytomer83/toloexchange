import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)]" style={{ background: 'var(--bg-card)' }}>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        {/* Main footer */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'var(--accent)' }}>
                <img src="/logo.png" alt="TOLO" className="w-7 h-7 object-cover" />
              </div>
              <span className="text-lg font-bold text-white">TOLO</span>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
              Swap digital assets instantly with a flat 0.5% fee. Simple, transparent, and secure.
            </p>
            <div className="flex gap-2.5">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white border border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white border border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Swap</Link></li>
              <li><Link href="/fees" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Fees</Link></li>
              <li><Link href="/support" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/legal/terms" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/privacy" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/aml" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors">AML Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Legal Entity</h3>
            <div className="space-y-1.5 text-xs text-[var(--text-secondary)] leading-relaxed">
              <p className="text-white font-medium">Polarbit Solutions Limited</p>
              <p>FINTRAC MSB Registration</p>
              <p className="font-mono text-[var(--text-muted)]">C10001398</p>
              <p className="mt-2">700-838 W Hastings Street</p>
              <p>Vancouver, BC V6C 0A6</p>
              <p>Canada</p>
              <p className="mt-2 text-[var(--text-muted)]">Inc. No: BC1547199</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Polarbit Solutions Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]" />
              FINTRAC Registered MSB
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
