'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getChainId } from '@/lib/web3';
import { CHAINS, SUPPORTED_CHAIN_IDS, SOLANA_CHAIN_ID, type Ecosystem } from '@/lib/tokens';

const STORAGE_KEY = 'tolo_wallet';

interface WalletState {
  connected: boolean;
  address: string;
  chainId: number | null;
  walletType: string;
  chainName: string;
  isSupported: boolean;
  ecosystem: Ecosystem;
}

interface WalletContextType extends WalletState {
  connect: (walletType: string, address: string, ecosystem?: Ecosystem) => void;
  disconnect: () => void;
  updateChain: (chainId: number) => void;
  switchEcosystem: (ecosystem: Ecosystem) => Promise<void>;
  openConnectModal: boolean;
  setOpenConnectModal: (open: boolean) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

function getEmptyState(): WalletState {
  return {
    connected: false,
    address: '',
    chainId: null,
    walletType: '',
    chainName: '',
    isSupported: false,
    ecosystem: 'evm',
  };
}

/** Wallet-type defaults */
function getDefaultEcosystem(walletType: string): Ecosystem {
  if (walletType === 'phantom') return 'solana';
  return 'evm';
}

/** Ecosystems a wallet can support */
export function getSupportedEcosystems(walletType: string): Ecosystem[] {
  if (walletType === 'phantom') return ['solana', 'evm'];
  if (walletType === 'metamask') return ['evm'];
  if (walletType === 'trustwallet') return ['evm'];
  return ['evm'];
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(getEmptyState());
  const [openConnectModal, setOpenConnectModal] = useState(false);

  // Restore wallet from localStorage on mount
  useEffect(() => {
    const tryRestore = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        const { walletType, address, ecosystem: savedEcosystem } = JSON.parse(saved) as {
          walletType: string;
          address: string;
          ecosystem?: Ecosystem;
        };
        if (!walletType || !address) return;

        const ecosystem = savedEcosystem || getDefaultEcosystem(walletType);

        if (ecosystem === 'solana') {
          // Restore Solana connection via Phantom
          const phantom = window.phantom?.solana;
          if (!phantom) return;

          try {
            const resp = await phantom.connect();
            const solAddress = resp.publicKey.toString();
            setState({
              connected: true,
              address: solAddress,
              chainId: SOLANA_CHAIN_ID,
              walletType,
              chainName: 'Solana',
              isSupported: true,
              ecosystem: 'solana',
            });
            // Update stored address if it changed
            if (solAddress !== address) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address: solAddress, ecosystem: 'solana' }));
            }
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
          return;
        }

        // EVM restore
        const ethereum = getEthereumProvider(walletType);
        if (!ethereum) return;

        const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
        if (!accounts || accounts.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        const currentAddress = accounts[0];
        if (currentAddress.toLowerCase() !== address.toLowerCase()) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address: currentAddress, ecosystem: 'evm' }));
          } catch { /* ignore */ }
        }

        let chainId: number | null = null;
        let chainName = '';
        let isSupported = false;

        try {
          const chainIdHex = await ethereum.request({ method: 'eth_chainId' }) as string;
          chainId = parseInt(chainIdHex, 16);
          const chain = CHAINS[chainId];
          chainName = chain?.shortName || `Chain ${chainId}`;
          isSupported = SUPPORTED_CHAIN_IDS.includes(chainId);
        } catch {
          // ignore chain detection failure
        }

        setState({
          connected: true,
          address: currentAddress,
          chainId,
          walletType,
          chainName,
          isSupported,
          ecosystem: 'evm',
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    tryRestore();
  }, []);

  // Listen for chain changes and account changes (EVM)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleChainChanged = (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      const chain = CHAINS[chainId];
      setState(prev => {
        if (!prev.connected || prev.ecosystem !== 'evm') return prev;
        return {
          ...prev,
          chainId,
          chainName: chain?.shortName || `Chain ${chainId}`,
          isSupported: SUPPORTED_CHAIN_IDS.includes(chainId),
        };
      });
    };

    const handleAccountsChanged = (accounts: string[]) => {
      setState(prev => {
        if (prev.ecosystem !== 'evm') return prev;
        if (accounts.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
          return getEmptyState();
        }
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            data.address = accounts[0];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch { /* ignore */ }
        }
        return { ...prev, address: accounts[0] };
      });
    };

    window.ethereum.on?.('chainChanged', handleChainChanged);
    window.ethereum.on?.('accountsChanged', handleAccountsChanged);

    if (window.phantom?.ethereum && window.phantom.ethereum !== window.ethereum) {
      window.phantom.ethereum.on?.('chainChanged', handleChainChanged);
      window.phantom.ethereum.on?.('accountsChanged', handleAccountsChanged);
    }

    return () => {
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
      if (window.phantom?.ethereum && window.phantom.ethereum !== window.ethereum) {
        window.phantom.ethereum.removeListener?.('chainChanged', handleChainChanged);
        window.phantom.ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const connect = useCallback(async (walletType: string, address: string, ecosystem?: Ecosystem) => {
    const eco = ecosystem || getDefaultEcosystem(walletType);

    if (eco === 'solana') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address, ecosystem: 'solana' }));
      setState({
        connected: true,
        address,
        chainId: SOLANA_CHAIN_ID,
        walletType,
        chainName: 'Solana',
        isSupported: true,
        ecosystem: 'solana',
      });
      return;
    }

    // EVM connect
    let chainId: number | null = null;
    let chainName = '';
    let isSupported = false;

    try {
      chainId = await getChainId();
      const chain = CHAINS[chainId];
      chainName = chain?.shortName || `Chain ${chainId}`;
      isSupported = SUPPORTED_CHAIN_IDS.includes(chainId);
    } catch {
      try {
        const provider = getEthereumProvider(walletType);
        if (provider) {
          const chainIdHex = await provider.request({ method: 'eth_chainId' }) as string;
          chainId = parseInt(chainIdHex, 16);
          const chain = CHAINS[chainId];
          chainName = chain?.shortName || `Chain ${chainId}`;
          isSupported = SUPPORTED_CHAIN_IDS.includes(chainId);
        }
      } catch {
        // ignore
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address, ecosystem: 'evm' }));

    setState({
      connected: true,
      address,
      chainId,
      walletType,
      chainName,
      isSupported,
      ecosystem: 'evm',
    });
  }, []);

  const disconnect = useCallback(() => {
    // If Solana Phantom, also disconnect from Phantom
    if (state.ecosystem === 'solana') {
      try {
        window.phantom?.solana?.disconnect();
      } catch { /* ignore */ }
    }
    localStorage.removeItem(STORAGE_KEY);
    setState(getEmptyState());
  }, [state.ecosystem]);

  const updateChain = useCallback((chainId: number) => {
    const chain = CHAINS[chainId];
    setState(prev => ({
      ...prev,
      chainId,
      chainName: chain?.shortName || `Chain ${chainId}`,
      isSupported: SUPPORTED_CHAIN_IDS.includes(chainId),
    }));
  }, []);

  /** Switch between ecosystems for wallets that support multiple (e.g. Phantom) */
  const switchEcosystem = useCallback(async (ecosystem: Ecosystem) => {
    const walletType = state.walletType;
    if (!walletType || !state.connected) return;

    const supported = getSupportedEcosystems(walletType);
    if (!supported.includes(ecosystem)) return;

    if (ecosystem === 'solana') {
      const phantom = window.phantom?.solana;
      if (!phantom) return;
      try {
        const resp = await phantom.connect();
        const solAddress = resp.publicKey.toString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address: solAddress, ecosystem: 'solana' }));
        setState({
          connected: true,
          address: solAddress,
          chainId: SOLANA_CHAIN_ID,
          walletType,
          chainName: 'Solana',
          isSupported: true,
          ecosystem: 'solana',
        });
      } catch { /* user rejected */ }
    } else {
      // Switch to EVM
      const evmProvider = getEthereumProvider(walletType);
      if (!evmProvider) return;
      try {
        const accounts = await evmProvider.request({ method: 'eth_requestAccounts' }) as string[];
        if (accounts.length > 0) {
          const chainIdHex = await evmProvider.request({ method: 'eth_chainId' }) as string;
          const chainId = parseInt(chainIdHex, 16);
          const chain = CHAINS[chainId];
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address: accounts[0], ecosystem: 'evm' }));
          setState({
            connected: true,
            address: accounts[0],
            chainId,
            walletType,
            chainName: chain?.shortName || `Chain ${chainId}`,
            isSupported: SUPPORTED_CHAIN_IDS.includes(chainId),
            ecosystem: 'evm',
          });
        }
      } catch { /* user rejected */ }
    }
  }, [state.walletType, state.connected]);

  return (
    <WalletContext.Provider value={{
      ...state,
      connect,
      disconnect,
      updateChain,
      switchEcosystem,
      openConnectModal,
      setOpenConnectModal,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

/** Helper: get the right EVM provider for a wallet type */
function getEthereumProvider(walletType: string): EthereumProvider | null {
  if (typeof window === 'undefined') return null;

  // Phantom has its own ethereum provider
  if (walletType === 'phantom') {
    return window.phantom?.ethereum || null;
  }

  const ethereum = window.ethereum;
  if (!ethereum) return null;

  // Handle multiple providers
  if (ethereum.providers?.length) {
    if (walletType === 'metamask') {
      return ethereum.providers.find((p) => p.isMetaMask && !p.isTrust) || null;
    }
    if (walletType === 'trustwallet') {
      return ethereum.providers.find((p) => p.isTrust) || null;
    }
  }

  return ethereum;
}
