'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Wallet } from 'lucide-react';
import ConnectWalletModal from './ConnectWallet';
import { useWallet } from '@/context/WalletContext';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const wallet = useWallet();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)]" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'var(--accent)' }}>
                <img src="/logo.png" alt="TOLO" className="w-8 h-8 object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-primary)]">TOLO</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <Link href="/" className="px-3 py-2 text-sm text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                Swap
              </Link>
              <Link href="/about" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                About
              </Link>
              <Link href="/fees" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                Fees
              </Link>
              <Link href="/support" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                Support
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Chain indicator */}
              {wallet.connected && wallet.chainName && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                  <div className={`w-2 h-2 rounded-full ${wallet.isSupported ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}`} />
                  <span className="text-[var(--text-secondary)]">{wallet.chainName}</span>
                </div>
              )}

              {/* Connect / Connected button */}
              {wallet.connected ? (
                <button
                  onClick={() => wallet.setOpenConnectModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border border-[var(--green)]"
                  style={{ background: 'rgba(22, 166, 114, 0.08)' }}
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--green)]" />
                  <span className="text-[var(--green)]">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                </button>
              ) : (
                <button
                  onClick={() => wallet.setOpenConnectModal(true)}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: 'var(--accent)' }}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                  <span className="sm:hidden">Connect</span>
                </button>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)]" style={{ background: 'var(--bg-primary)' }}>
            <div className="px-4 py-3 space-y-1">
              {[
                { name: 'Swap', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Fees', href: '/fees' },
                { name: 'Support', href: '/support' },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <ConnectWalletModal
        isOpen={wallet.openConnectModal}
        onClose={() => wallet.setOpenConnectModal(false)}
        onConnected={(walletType, address) => {
          wallet.connect(walletType, address);
        }}
        connectedWallet={wallet.connected ? { type: wallet.walletType, address: wallet.address } : null}
        onDisconnect={() => {
          wallet.disconnect();
        }}
      />
    </>
  );
}
