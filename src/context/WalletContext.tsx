'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getChainId } from '@/lib/web3';
import { CHAINS, SUPPORTED_CHAIN_IDS } from '@/lib/tokens';

const STORAGE_KEY = 'tolo_wallet';

interface WalletState {
  connected: boolean;
  address: string;
  chainId: number | null;
  walletType: string;
  chainName: string;
  isSupported: boolean;
}

interface WalletContextType extends WalletState {
  connect: (walletType: string, address: string) => void;
  disconnect: () => void;
  updateChain: (chainId: number) => void;
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
  };
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

        const { walletType, address } = JSON.parse(saved) as { walletType: string; address: string };
        if (!walletType || !address) return;

        // Verify the wallet is still connected by checking accounts
        const ethereum = getEthereumProvider(walletType);
        if (!ethereum) return;

        const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
        if (!accounts || accounts.length === 0) {
          // Wallet no longer connected
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        // Wallet is still connected, restore state. Always trust the live
        // address reported by the provider, NOT the one we previously
        // stashed in localStorage — the user may have switched accounts
        // inside the wallet since their last visit.
        const currentAddress = accounts[0];
        if (currentAddress.toLowerCase() !== address.toLowerCase()) {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address: currentAddress }));
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
        });
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    tryRestore();
  }, []);

  // Listen for chain changes and account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleChainChanged = (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      const chain = CHAINS[chainId];
      setState(prev => {
        if (!prev.connected) return prev;
        return {
          ...prev,
          chainId,
          chainName: chain?.shortName || `Chain ${chainId}`,
          isSupported: SUPPORTED_CHAIN_IDS.includes(chainId),
        };
      });
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Disconnected from wallet side
        localStorage.removeItem(STORAGE_KEY);
        setState(getEmptyState());
      } else {
        setState(prev => ({ ...prev, address: accounts[0] }));
        // Update localStorage with new address
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const data = JSON.parse(saved);
            data.address = accounts[0];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          } catch { /* ignore */ }
        }
      }
    };

    window.ethereum.on?.('chainChanged', handleChainChanged);
    window.ethereum.on?.('accountsChanged', handleAccountsChanged);

    // Also listen on phantom.ethereum if available
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

  const connect = useCallback(async (walletType: string, address: string) => {
    let chainId: number | null = null;
    let chainName = '';
    let isSupported = false;

    try {
      chainId = await getChainId();
      const chain = CHAINS[chainId];
      chainName = chain?.shortName || `Chain ${chainId}`;
      isSupported = SUPPORTED_CHAIN_IDS.includes(chainId);
    } catch {
      // Could not detect chain, try wallet-specific provider
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

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType, address }));

    setState({
      connected: true,
      address,
      chainId,
      walletType,
      chainName,
      isSupported,
    });
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(getEmptyState());
  }, []);

  const updateChain = useCallback((chainId: number) => {
    const chain = CHAINS[chainId];
    setState(prev => ({
      ...prev,
      chainId,
      chainName: chain?.shortName || `Chain ${chainId}`,
      isSupported: SUPPORTED_CHAIN_IDS.includes(chainId),
    }));
  }, []);

  return (
    <WalletContext.Provider value={{
      ...state,
      connect,
      disconnect,
      updateChain,
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
