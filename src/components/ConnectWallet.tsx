'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Check, Loader2, ChevronRight, AlertTriangle, Wallet, Download, Smartphone } from 'lucide-react';

type WalletType = 'phantom' | 'solflare' | 'metamask' | 'trustwallet';
type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'not-installed';

interface WalletInfo {
  id: WalletType;
  name: string;
  icon: string;
  networks: string[];
  color: string;
  downloadUrl: string;
  deepLinkBase: string;
}

const wallets: WalletInfo[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '/wallets/metamask.svg',
    networks: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'],
    color: '#F6851B',
    downloadUrl: 'https://metamask.io/download/',
    deepLinkBase: 'https://metamask.app.link/dapp/',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '/wallets/phantom.svg',
    networks: ['Solana', 'Ethereum', 'Polygon'],
    color: '#AB9FF2',
    downloadUrl: 'https://phantom.app/',
    deepLinkBase: 'https://phantom.app/ul/browse/',
  },
  {
    id: 'solflare',
    name: 'Solflare',
    icon: '/wallets/solflare.svg',
    networks: ['Solana'],
    color: '#FC8E2C',
    downloadUrl: 'https://solflare.com/',
    deepLinkBase: 'https://solflare.com/ul/v1/browse/',
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '/wallets/trustwallet.svg',
    networks: ['Ethereum', 'BSC', 'Polygon', 'Solana', 'Arbitrum', 'Avalanche'],
    color: '#3375BB',
    downloadUrl: 'https://trustwallet.com/',
    deepLinkBase: 'https://link.trustwallet.com/open_url?coin_id=60&url=',
  },
];

// --- Helpers ---

function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isInWalletBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  // Check if we're inside a wallet's in-app browser
  return !!(
    window.ethereum?.isMetaMask ||
    window.ethereum?.isTrust ||
    window.phantom?.solana ||
    window.solana?.isPhantom ||
    window.solflare
  );
}

function getDeepLink(wallet: WalletInfo): string {
  if (typeof window === 'undefined') return wallet.downloadUrl;
  const currentUrl = window.location.href;

  switch (wallet.id) {
    case 'metamask':
      // MetaMask deep link: opens current dapp in MetaMask's browser
      return `${wallet.deepLinkBase}${window.location.host}${window.location.pathname}`;
    case 'phantom': {
      // Phantom deep link: opens URL in Phantom browser
      const encodedUrl = encodeURIComponent(currentUrl);
      return `${wallet.deepLinkBase}${encodedUrl}?ref=${encodeURIComponent(window.location.origin)}`;
    }
    case 'solflare': {
      // Solflare deep link
      const encodedUrl = encodeURIComponent(currentUrl);
      return `${wallet.deepLinkBase}${encodedUrl}`;
    }
    case 'trustwallet': {
      // Trust Wallet deep link
      const encodedUrl = encodeURIComponent(currentUrl);
      return `${wallet.deepLinkBase}${encodedUrl}`;
    }
    default:
      return wallet.downloadUrl;
  }
}

function WalletIconSVG({ wallet, size = 40 }: { wallet: WalletInfo; size?: number }) {
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

// --- Web3 Provider Helpers ---

function getEVMProvider(walletId: WalletType): EthereumProvider | null {
  const ethereum = window.ethereum;
  if (!ethereum) return null;

  // Handle multiple providers (when both MetaMask and Trust are installed)
  if (ethereum.providers?.length) {
    if (walletId === 'metamask') {
      return ethereum.providers.find((p: EthereumProvider) => p.isMetaMask && !p.isTrust) || null;
    }
    if (walletId === 'trustwallet') {
      return ethereum.providers.find((p: EthereumProvider) => p.isTrust) || null;
    }
  }

  // Single provider
  if (walletId === 'metamask' && ethereum.isMetaMask) return ethereum;
  if (walletId === 'trustwallet') return ethereum; // Trust Wallet may not always set isTrust
  return null;
}

function getSolanaProvider(walletId: WalletType): SolanaProvider | null {
  if (walletId === 'phantom') {
    return window.phantom?.solana || (window.solana?.isPhantom ? window.solana : null) || null;
  }
  if (walletId === 'solflare') {
    return window.solflare || null;
  }
  return null;
}

// --- Component ---

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (wallet: WalletType, address: string) => void;
}

export default function ConnectWalletModal({ isOpen, onClose, onConnected }: ConnectWalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  if (!isOpen) return null;

  const handleConnect = async (wallet: WalletInfo) => {
    setSelectedWallet(wallet);
    setStatus('connecting');
    setErrorMessage('');

    try {
      let address = '';
      const isEVM = wallet.id === 'metamask' || wallet.id === 'trustwallet';

      if (isEVM) {
        const provider = getEVMProvider(wallet.id);
        if (!provider) {
          // On mobile, if provider not found, redirect to deep link
          if (mobile) {
            setStatus('not-installed');
            return;
          }
          setStatus('not-installed');
          return;
        }
        const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts returned');
        }
        address = accounts[0];
      } else {
        // Solana wallets (Phantom, Solflare)
        const provider = getSolanaProvider(wallet.id);
        if (!provider) {
          if (mobile) {
            setStatus('not-installed');
            return;
          }
          setStatus('not-installed');
          return;
        }
        const response = await provider.connect();
        address = response.publicKey.toString();
      }

      setConnectedAddress(address);
      setStatus('connected');
      // Don't fire onConnected here — wait for "Continue to Deposit" click
    } catch (err: unknown) {
      console.error('Wallet connection failed:', err);
      const message = err instanceof Error ? err.message : String(err);

      // User rejected the request
      if (message.includes('User rejected') || message.includes('4001') || message.includes('rejected')) {
        handleBack();
        return;
      }

      setErrorMessage(message);
      setStatus('error');
    }
  };

  const handleBack = () => {
    setSelectedWallet(null);
    setStatus('idle');
    setConnectedAddress('');
    setErrorMessage('');
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
            <h3 className="font-semibold text-white text-sm sm:text-base">
              {status === 'connected' ? 'Wallet Connected' : selectedWallet ? `Connecting to ${selectedWallet.name}` : 'Connect Wallet'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white text-xl">&times;</button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {status === 'idle' && !selectedWallet && (
            <>
              <p className="text-sm text-[var(--text-secondary)] mb-4">Choose your preferred wallet to connect:</p>

              <div className="space-y-2">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet)}
                    className="w-full flex items-center gap-3 p-3 sm:p-3.5 rounded-xl border border-[var(--border)] hover:border-[var(--text-muted)] transition-all group"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <WalletIconSVG wallet={wallet} />
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white group-hover:text-[var(--accent)] transition-colors">{wallet.name}</div>
                      <div className="text-[10px] text-[var(--text-muted)] truncate">{wallet.networks.join(' · ')}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-white transition-colors shrink-0" />
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
                <WalletIconSVG wallet={selectedWallet} size={64} />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" />
                <span className="text-sm font-medium text-white">Connecting to {selectedWallet.name}...</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {mobile && isInWalletBrowser()
                  ? 'Please approve the connection request'
                  : 'Please approve the connection in your wallet extension'
                }
              </p>
              <div className="mt-6 flex flex-col items-center gap-2">
                <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="h-full rounded-full animate-pulse" style={{ background: 'linear-gradient(90deg, #00b4d8, #c026d3)', width: '60%' }} />
                </div>
              </div>
              <button onClick={handleBack} className="mt-4 text-xs text-[var(--text-muted)] hover:text-white transition-colors">
                Cancel
              </button>
            </div>
          )}

          {status === 'connected' && selectedWallet && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(33, 193, 135, 0.12)' }}>
                <Check className="w-8 h-8 text-[var(--green)]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Connected!</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-4">{selectedWallet.name} wallet connected successfully</p>

              <div className="rounded-lg p-3 mb-4" style={{ background: 'var(--bg-secondary)' }}>
                <div className="text-[10px] text-[var(--text-muted)] mb-1">Wallet Address</div>
                <div className="text-xs font-mono text-white break-all">{connectedAddress.slice(0, 8)}...{connectedAddress.slice(-8)}</div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    if (selectedWallet) {
                      onConnected(selectedWallet.id, connectedAddress);
                    }
                  }, 150);
                }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: 'var(--accent, #2f8af5)' }}
              >
                Start Swapping
              </button>
            </div>
          )}

          {status === 'not-installed' && selectedWallet && (
            <div className="text-center py-6">
              <div className="mx-auto mb-4">
                <WalletIconSVG wallet={selectedWallet} size={64} />
              </div>

              {mobile ? (
                <>
                  {/* Mobile: Show deep link to open in wallet app */}
                  <h4 className="text-lg font-bold text-white mb-2">Open in {selectedWallet.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-5 max-w-xs mx-auto">
                    Tap below to open this page in {selectedWallet.name}&apos;s in-app browser, where you can connect securely.
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {/* Deep link — opens the wallet app with this page */}
                    <a
                      href={getDeepLink(selectedWallet)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--accent, #2f8af5)' }}
                    >
                      <Smartphone className="w-4 h-4" />
                      Open in {selectedWallet.name}
                    </a>

                    {/* Fallback: download from app store */}
                    <a
                      href={selectedWallet.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] border border-[var(--border)] hover:text-white hover:border-[var(--text-secondary)] transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Don&apos;t have it? Install {selectedWallet.name}
                    </a>
                  </div>

                  <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(0, 180, 216, 0.06)', border: '1px solid rgba(0, 180, 216, 0.12)' }}>
                    <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                      <strong className="text-[var(--text-secondary)]">How it works:</strong> Tapping &ldquo;Open in {selectedWallet.name}&rdquo; will launch the wallet app. This site will load inside the wallet&apos;s secure browser where you can connect directly.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Desktop: Show install extension prompt */}
                  <h4 className="text-lg font-bold text-white mb-1">{selectedWallet.name} Not Found</h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-6">
                    The {selectedWallet.name} extension is not installed in your browser. Install it to connect.
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={selectedWallet.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--accent, #2f8af5)' }}
                    >
                      <Download className="w-4 h-4" />
                      Install {selectedWallet.name}
                    </a>
                  </div>
                </>
              )}

              <button onClick={handleBack} className="mt-4 px-6 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-white transition-colors">
                Choose Another Wallet
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(246, 70, 93, 0.15)' }}>
                <AlertTriangle className="w-8 h-8 text-[var(--red)]" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1">Connection Failed</h4>
              <p className="text-xs text-[var(--text-secondary)] mb-1">Could not connect to wallet. Please try again.</p>
              {errorMessage && (
                <p className="text-[10px] text-[var(--text-muted)] mb-4 max-w-xs mx-auto break-all">{errorMessage}</p>
              )}

              {/* On mobile, offer to open in wallet app as fallback */}
              {mobile && selectedWallet && (
                <a
                  href={getDeepLink(selectedWallet)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white mb-3 transition-all hover:opacity-90"
                  style={{ background: 'var(--accent, #2f8af5)' }}
                >
                  <Smartphone className="w-4 h-4" />
                  Open in {selectedWallet.name} App
                </a>
              )}

              <button onClick={handleBack} className="block mx-auto px-6 py-2.5 rounded-xl text-sm font-medium text-white border border-[var(--border)] hover:border-[var(--text-secondary)]">
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
      className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
      style={{ background: 'var(--accent, #2f8af5)' }}
    >
      <Wallet className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </button>
  );
}
