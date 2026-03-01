'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, Globe, User, Wallet } from 'lucide-react';
import ConnectWalletModal, { ConnectWalletButton } from './ConnectWallet';

const navigation = [
  { name: 'Markets', href: '/markets' },
  { name: 'Trade', href: '/trade' },
  { name: 'Swap', href: '/swap' },
  { name: 'Wallet', href: '/wallet' },
  {
    name: 'More',
    children: [
      { name: 'About Us', href: '/about' },
      { name: 'Fees', href: '/fees' },
      { name: 'API', href: '/api-docs' },
      { name: 'Support', href: '/support' },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const router = useRouter();

  const handleWalletConnected = (walletType: string, address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    // After connecting from header, navigate to wallet page for deposit
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/wallet')) {
      router.push('/wallet');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--border)]" style={{ background: 'rgba(11, 14, 17, 0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}>
                <img src="/logo.png" alt="TOLO" className="w-8 h-8 object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">TOLO</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-8">
              {navigation.map((item) =>
                item.children ? (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(item.name)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <button className="flex items-center gap-1 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors rounded-lg">
                      {item.name}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {dropdownOpen === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-48 rounded-xl overflow-hidden border border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-tertiary)] transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors rounded-lg"
                  >
                    {item.name}
                  </Link>
                )
              )}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-3">
              <ConnectWalletButton
                onClick={() => setWalletModalOpen(true)}
                connected={walletConnected}
                address={walletAddress}
              />
              {!walletConnected && (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              )}
              <Link
                href="/wallet"
                className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-all hover:opacity-90 flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
              >
                <Wallet className="w-3.5 h-3.5" /> Deposit
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center gap-2">
              <ConnectWalletButton
                onClick={() => setWalletModalOpen(true)}
                connected={walletConnected}
                address={walletAddress}
              />
              <button
                className="p-2 text-[var(--text-secondary)]"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[var(--border)]" style={{ background: 'var(--bg-primary)' }}>
            <div className="px-4 py-3 space-y-1">
              {navigation.map((item) =>
                item.children ? (
                  <div key={item.name}>
                    <div className="px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)]">{item.name}</div>
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className="block pl-6 pr-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              )}
              <div className="pt-3 flex gap-3 border-t border-[var(--border)]">
                {!walletConnected && (
                  <Link
                    href="/login"
                    className="flex-1 py-2.5 text-center text-sm font-medium text-white border border-[var(--border)] rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
                <Link
                  href="/wallet"
                  className="flex-1 py-2.5 text-center text-sm font-medium text-white rounded-lg flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  <Wallet className="w-3.5 h-3.5" /> Deposit
                </Link>
              </div>
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
