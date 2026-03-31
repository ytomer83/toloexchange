'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, Loader2, ChevronRight, AlertTriangle, Wallet, Download, Smartphone, LogOut } from 'lucide-react';

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
    networks: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'Base'],
    color: '#F6851B',
    downloadUrl: 'https://metamask.io/download/',
    deepLinkBase: 'https://metamask.app.link/dapp/',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '/wallets/phantom.svg',
    networks: ['Ethereum', 'Polygon', 'Base', 'Solana'],
    color: '#AB9FF2',
    downloadUrl: 'https://phantom.app/',
    deepLinkBase: 'https://phantom.app/ul/browse/',
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '/wallets/trustwallet.svg',
    networks: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Avalanche'],
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

function getDeepLink(wallet: WalletInfo): string {
  if (typeof window === 'undefined') return wallet.downloadUrl;
  const currentUrl = window.location.href;

  switch (wallet.id) {
    case 'metamask':
      return `${wallet.deepLinkBase}${window.location.host}${window.location.pathname}`;
    case 'phantom': {
      const encodedUrl = encodeURIComponent(currentUrl);
      return `${wallet.deepLinkBase}${encodedUrl}?ref=${encodeURIComponent(window.location.origin)}`;
    }
    case 'trustwallet': {
      const encodedUrl = encodeURIComponent(currentUrl);
      return `${wallet.deepLinkBase}${encodedUrl}`;
    }
    default:
      return wallet.downloadUrl;
  }
}

function WalletIconImg({ wallet, size = 40 }: { wallet: WalletInfo; size?: number }) {
  return (
    <img
      src={wallet.icon}
      alt={wallet.name}
      width={size}
      height={size}
      className="rounded-xl"
      style={{ width: size, height: size }}
    />
  );
}

// --- Web3 Provider Helpers ---

/** Get the EVM provider for a specific wallet */
function getEVMProvider(walletId: WalletType): EthereumProvider | null {
  if (typeof window === 'undefined') return null;

  // Phantom has its own EVM provider at window.phantom.ethereum
  if (walletId === 'phantom') {
    return window.phantom?.ethereum || null;
  }

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
  if (walletId === 'trustwallet') return ethereum;
  return null;
}

// --- Component ---

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (wallet: WalletType, address: string) => void;
  connectedWallet?: { type: string; address: string } | null;
  onDisconnect?: () => void;
}

export default function ConnectWalletModal({ isOpen, onClose, onConnected, connectedWallet, onDisconnect }: ConnectWalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<WalletInfo | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [mobile, setMobile] = useState(false);
  const connectingRef = useRef(false); // Prevent double-connection attempts

  useEffect(() => {
    setMobile(isMobile());
  }, []);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && !connectedWallet) {
      setSelectedWallet(null);
      setStatus('idle');
      setConnectedAddress('');
      setErrorMessage('');
      connectingRef.current = false;
    }
  }, [isOpen, connectedWallet]);

  if (!isOpen) return null;

  // If already connected, show the connected wallet info with disconnect option
  if (connectedWallet) {
    const walletInfo = wallets.find(w => w.id === connectedWallet.type);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
        <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden animate-fade-in" style={{ background: 'var(--bg-card)' }}>
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-[var(--accent)]" />
              <h3 className="font-semibold text-white text-sm sm:text-base">Wallet Connected</h3>
            </div>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white text-xl">&times;</button>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              {walletInfo && <WalletIconImg wallet={walletInfo} size={48} />}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{walletInfo?.name || connectedWallet.type}</div>
                <div className="text-xs font-mono text-[var(--text-muted)] truncate">{connectedWallet.address}</div>
              </div>
              <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
            </div>

            <div className="rounded-xl p-4 mb-4" style={{ background: 'var(--bg-secondary)' }}>
              <div className="text-[10px] text-[var(--text-muted)] mb-1.5">Wallet Address</div>
              <div className="text-xs font-mono text-white break-all">{connectedWallet.address}</div>
            </div>

            <button
              onClick={() => {
                onDisconnect?.();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-[var(--red)] border border-[var(--red)] hover:bg-[var(--red)] hover:text-white transition-all"
              style={{ borderColor: 'rgba(246, 70, 93, 0.4)' }}
            >
              <LogOut className="w-4 h-4" />
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConnect = async (wallet: WalletInfo) => {
    // Prevent double-clicks / concurrent connection attempts
    if (connectingRef.current) return;
    connectingRef.current = true;

    setSelectedWallet(wallet);
    setStatus('connecting');
    setErrorMessage('');

    try {
      let address = '';

      // All wallets now connect via EVM
      const provider = getEVMProvider(wallet.id);
      if (!provider) {
        if (mobile) {
          setStatus('not-installed');
          connectingRef.current = false;
          return;
        }
        setStatus('not-installed');
        connectingRef.current = false;
        return;
      }

      // First try eth_accounts (no popup) to see if already authorized
      let accounts: string[] = [];
      try {
        accounts = await provider.request({ method: 'eth_accounts' }) as string[];
      } catch {
        // Some wallets might not support eth_accounts — that's fine
      }

      // If no existing accounts, request new connection
      if (!accounts || accounts.length === 0) {
        accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned. Please unlock your wallet and try again.');
      }

      address = accounts[0];

      // Validate we got an EVM address
      if (!address.startsWith('0x')) {
        throw new Error('Invalid address returned. Please make sure your wallet is set to an EVM network (Ethereum, Polygon, etc.).');
      }

      setConnectedAddress(address);
      setStatus('connected');
    } catch (err: unknown) {
      console.error('Wallet connection failed:', err);

      // Extract meaningful error message
      let message = 'Connection failed. Please try again.';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errObj = err as Record<string, unknown>;
        if (typeof errObj.message === 'string') {
          message = errObj.message;
        } else if (typeof errObj.reason === 'string') {
          message = errObj.reason;
        } else if (typeof errObj.code === 'number') {
          message = `Wallet error (code: ${errObj.code})`;
        }
      } else if (typeof err === 'string') {
        message = err;
      }

      // User rejected
      if (message.includes('User rejected') || message.includes('4001') || message.includes('rejected') || message.includes('denied')) {
        handleBack();
        return;
      }

      // MetaMask "already pending" — the user has an open popup
      if (message.includes('already pending')) {
        setErrorMessage('MetaMask already has a pending request. Please open the MetaMask extension (click the fox icon in your browser toolbar) and approve or reject the pending request.');
        setStatus('error');
        connectingRef.current = false;
        return;
      }

      setErrorMessage(message);
      setStatus('error');
    } finally {
      connectingRef.current = false;
    }
  };

  const handleBack = () => {
    setSelectedWallet(null);
    setStatus('idle');
    setConnectedAddress('');
    setErrorMessage('');
    connectingRef.current = false;
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
                    <WalletIconImg wallet={wallet} />
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
              <div className="mx-auto mb-4 flex justify-center">
                <WalletIconImg wallet={selectedWallet} size={64} />
              </div>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin" />
                <span className="text-sm font-medium text-white">Connecting to {selectedWallet.name}...</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Please approve the connection in your wallet extension
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
              <div className="mx-auto mb-4 flex justify-center">
                <WalletIconImg wallet={selectedWallet} size={64} />
              </div>

              {mobile ? (
                <>
                  <h4 className="text-lg font-bold text-white mb-2">Open in {selectedWallet.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mb-5 max-w-xs mx-auto">
                    Tap below to open this page in {selectedWallet.name}&apos;s in-app browser, where you can connect securely.
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href={getDeepLink(selectedWallet)}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                      style={{ background: 'var(--accent, #2f8af5)' }}
                    >
                      <Smartphone className="w-4 h-4" />
                      Open in {selectedWallet.name}
                    </a>

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
              <p className="text-xs text-[var(--text-secondary)] mb-1">Could not connect to wallet.</p>
              {errorMessage && (
                <p className="text-xs text-[var(--text-muted)] mb-4 max-w-xs mx-auto leading-relaxed">{errorMessage}</p>
              )}

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
