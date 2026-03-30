'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Wallet } from 'lucide-react';
import ConnectWalletModal, { ConnectWalletButton } from './ConnectWallet';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleWalletConnected = (walletType: string, address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)]" style={{ background: 'rgba(6, 7, 10, 0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'var(--accent)' }}>
                <img src="/logo.png" alt="TOLO" className="w-8 h-8 object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TOLO</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              <Link href="/" className="px-3 py-2 text-sm text-white font-medium rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                Swap
              </Link>
              <Link href="/about" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                About
              </Link>
              <Link href="/fees" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                Fees
              </Link>
              <Link href="/support" className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                Support
              </Link>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <ConnectWalletButton
                onClick={() => setWalletModalOpen(true)}
                connected={walletConnected}
                address={walletAddress}
              />

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-[var(--text-secondary)] hover:text-white"
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
                  className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white rounded-lg"
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
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnected={handleWalletConnected}
      />
    </>
  );
}
