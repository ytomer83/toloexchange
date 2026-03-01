'use client';

import { useState } from 'react';
import { X, ExternalLink, Check, Loader2, ChevronRight, AlertTriangle, Wallet } from 'lucide-react';

type WalletType = 'phantom' | 'solflare' | 'metamask' | 'trustwallet';
type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface WalletInfo {
  id: WalletType;
  name: string;
  icon: string;
  networks: string[];
  color: string;
  downloadUrl: string;
}

const wallets: WalletInfo[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/wallets/metamask.svg',
    networks: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'],
    color: '#F6851B',
    downloadUrl: 'https://metamask.io/download/',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '/wallets/phantom.svg',
    networks: ['Solana', 'Ethereum', 'Polygon'],
    color: '#AB9FF2',
    downloadUrl: 'https://phantom.app/',
  },
  {
    id: 'solflare',
    name: 'Solflare',
    icon: '/wallets/solflare.svg',
    networks: ['Solana'],
    color: '#FC8E2C',
    downloadUrl: 'https://solflare.com/',
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '/wallets/trustwallet.svg',
    networks: ['Ethereum', 'BSC', 'Polygon', 'Solana', 'Arbitrum', 'Avalanche'],
    color: '#3375BB',
    downloadUrl: 'https://trustwallet.com/',
  },
];

function WalletIcon({ wallet, size = 40 }: { wallet: WalletInfo; size?: number }) {
  const iconMap: Record<WalletType, React.ReactNode> = {
    metamask: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#F6851B" fillOpacity="0.15"/>
        <path d="M29.5 10L21.2 16.2l1.5-5.7L29.5 10z" fill="#E17726"/>
        <path d="M10.5 10l8.2 6.3-1.4-5.8L10.5 10zM26.7 25l-2.2 3.4 4.7 1.3 1.4-4.6-3.9-.1zM9.4 25.1l1.3 4.6 4.7-1.3-2.2-3.4-3.8.1z" fill="#E27625"/>
        <path d="M15.1 18.5l-1.3 2 4.6.2-.2-5-3.1 2.8zM24.9 18.5L21.7 15.6l-.1 5.1 4.6-.2-1.3-2z" fill="#E27625"/>
        <path d="M15.4 28.4l2.8-1.4-2.4-1.9-.4 3.3zM21.8 27l2.8 1.4-.4-3.3-2.4 1.9z" fill="#E27625"/>
        <path d="M24.6 28.4l-2.8-1.4.2 1.8v.8l2.6-1.2zM15.4 28.4l2.6 1.2v-.8l.2-1.8-2.8 1.4z" fill="#D5BFB2"/>
        <path d="M18.1 23.5l-2.3-.7 1.6-.7.7 1.4zM21.9 23.5l.7-1.4 1.6.7-2.3.7z" fill="#233447"/>
        <path d="M15.4 28.4l.4-3.4-2.6.1 2.2 3.3zM24.2 25l.4 3.4 2.2-3.3-2.6-.1zM26.2 20.5l-4.6.2.4 2.8.7-1.4 1.6.7 1.9-2.3zM15.8 22.8l1.6-.7.7 1.4.4-2.8-4.6-.2 1.9 2.3z" fill="#CC6228"/>
        <circle cx="20" cy="20" r="3" fill="#F6851B" fillOpacity="0.3"/>
      </svg>
    ),
    phantom: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#AB9FF2" fillOpacity="0.15"/>
        <path d="M29.4 20.6c0 5.2-4.2 9.4-9.4 9.4s-9.4-4.2-9.4-9.4 4.2-9.4 9.4-9.4 9.4 4.2 9.4 9.4z" fill="url(#phantomGrad)"/>
        <defs><linearGradient id="phantomGrad" x1="10.6" y1="11.2" x2="29.4" y2="30"><stop stopColor="#534BB1"/><stop offset="1" stopColor="#AB9FF2"/></linearGradient></defs>
        <circle cx="16.5" cy="19" r="1.8" fill="white"/>
        <circle cx="23.5" cy="19" r="1.8" fill="white"/>
      </svg>
    ),
    solflare: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#FC8E2C" fillOpacity="0.15"/>
        <circle cx="20" cy="20" r="8" fill="url(#solflareGrad)"/>
        <defs><linearGradient id="solflareGrad" x1="12" y1="12" x2="28" y2="28"><stop stopColor="#FC8E2C"/><stop offset="1" stopColor="#FCD34D"/></linearGradient></defs>
        <path d="M20 14l2 4h-4l2-4zM20 26l-2-4h4l-2 4zM14 20l4-2v4l-4-2zM26 20l-4 2v-4l4 2z" fill="white" fillOpacity="0.9"/>
      </svg>
    ),
    trustwallet: (
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="10" fill="#3375BB" fillOpacity="0.15"/>
        <path d="M20 10c3.6 2.4 7 2.8 9 2.6 0 0-.2 10.2-9 17.4-8.8-7.2-9-17.4-9-17.4 2 .2 5.4-.2 9-2.6z" fill="url(#trustGrad)" stroke="#3375BB" strokeWidth="0.5"/>
        <defs><linearGradient id="trustGrad" x1="11" y1="10" x2="29" y2="30"><stop stopColor="#3375BB"/><stop offset="1" stopColor="#48A9E6"/></linearGradient></defs>
        <path d="M18 19l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return iconMap[wallet.id];
}

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (wallet: WalletType, address: string) => void;
}

export default function ConnectWalletModal({ isOpen, onClose, onConnected }: ConnectWalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [connectedAddress, setConnectedAddress] = useState('');

  if (!isOpen) return null;

  const handleConnect = async (wallet: WalletInfo) => {
    setSelectedWallet(wallet);
    setStatus('connecting');

    // Simulate wallet connection
    await new Promise(r => setTimeout(r, 2000));

    // Generate a mock address
    const chars = '0123456789abcdef';
    const addr = wallet.id === 'phantom' || wallet.id === 'solflare'
      ? Array.from({ length: 44 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'[Math.floor(Math.random() * 58)]).join('')
      : '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * 16)]).join('');

    setConnectedAddress(addr);
    setStatus('connected');
    onConnected(wallet.id, addr);
  };

  const handleBack = () => {
    setSelectedWallet(null);
    setStatus('idle');
    setConnectedAddress('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in" style={{ background: 'var(--bg-card)' }}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedWallet && status !== 'idle' && (
              <button onClick={handleBack} className="text-[var(--text-muted)] hover:text-white mr-1 text-lg">&larr;</button>
            )}
            <Wallet className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="font-semibold text-white">
              {status === 'connected' ? 'Wallet Connected' : selectedWallet ? `Connecting to ${selectedWallet.name}` : 'Connect Wallet'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white text-xl">&times;</button>
        </div>

        {/* Content */}
        <div className="p-5">
          {status === 'idle' && !selectedWallet && (
            <>
              {/* Promo reminder */}
              <div className="rounded-xl p-3 mb-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.08), rgba(249, 115, 22, 0.08))', border: '1px solid rgba(250, 204, 21, 0.15)' }}>
                <span className="text-xl">🎁</span>
                <div>
                  <div className="text-xs font-bold text-yellow-400">Deposit $100 → Get $500 Bonus</div>
                  <div className="text-[10px] text-[var(--text-muted)]">Connect wallet & deposit to claim instantly</div>
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] mb-4">Choose your preferred wallet to connect and deposit:</p>

              <div className="space-y-2">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet)}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-all group"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <WalletIcon wallet={wallet} />
                    <div className="text-left flex-1">
                      <div className="text-sm font-semibold text-white group-hover:text-[var(--accent)] transition-colors">{wallet.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)]">{wallet.networks.join(' · ')}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>

              <p className="text-[10px] text-[var(--text-muted)] text-center mt-4">
                By connecting, you agree to our <a href="/legal/terms" className="text-[var(--accent)] hover:underline">Terms of Service</a>
              </p>
            </>
          )}

          {status === 'connecting' && selectedWallet && (
            <div className="text-center py-8">
              <div className="mx-auto mb-4">
                <WalletIcon wallet={selectedWallet} size={64} />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" />
                <span className="text-sm font-medium text-white">Connecting to {selectedWallet.name}...</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Please approve the connection in your wallet</p>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="h-full rounded-full animate-pulse" style={{ background: 'linear-gradient(90deg, #00b4d8, #c026d3)', width: '60%' }} />
                </div>
              </div>
            </div>
          )}

          {status === 'connected' && selectedWallet && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(14, 203, 129, 0.15)' }}>
                <Check className="w-8 h-8 text-[var(--green)]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Connected!</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4">{selectedWallet.name} wallet connected successfully</p>

              <div className="rounded-lg p-3 mb-4" style={{ background: 'var(--bg-secondary)' }}>
                <div className="text-[10px] text-[var(--text-muted)] mb-1">Wallet Address</div>
                <div className="text-xs font-mono text-white break-all">{connectedAddress.slice(0, 8)}...{connectedAddress.slice(-8)}</div>
              </div>

              {/* Bonus reminder */}
              <div className="rounded-xl p-4 mb-4 text-left" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.08), rgba(249, 115, 22, 0.08))', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
                <div className="text-sm font-bold text-yellow-400 mb-1">🎁 $500 Bonus Ready!</div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Deposit $100 or more to claim your $500 trading bonus. The bonus will be credited to your account instantly.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #facc15, #f97316)' }}
              >
                Continue to Deposit
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(246, 70, 93, 0.15)' }}>
                <AlertTriangle className="w-8 h-8 text-[var(--red)]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Connection Failed</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4">Could not connect to wallet. Please try again.</p>
              <button onClick={handleBack} className="px-6 py-2.5 rounded-xl text-sm font-medium text-white border border-[var(--border)] hover:border-[var(--text-secondary)]">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Small connect wallet button for header
export function ConnectWalletButton({ onClick, connected, address }: { onClick: () => void; connected: boolean; address?: string }) {
  if (connected && address) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors border border-[var(--green)]"
        style={{ background: 'rgba(14, 203, 129, 0.1)' }}
      >
        <div className="w-2 h-2 rounded-full bg-[var(--green)]" />
        <span className="text-[var(--green)]">{address.slice(0, 4)}...{address.slice(-4)}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-black transition-all hover:opacity-90"
      style={{ background: 'linear-gradient(135deg, #facc15, #f97316)' }}
    >
      <Wallet className="w-3.5 h-3.5" />
      Connect Wallet
    </button>
  );
}
