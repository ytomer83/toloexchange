'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getChainId } from '@/lib/web3';
import { CHAINS, SUPPORTED_CHAIN_IDS } from '@/lib/tokens';

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

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    address: '',
    chainId: null,
    walletType: '',
    chainName: '',
    isSupported: false,
  });
  const [openConnectModal, setOpenConnectModal] = useState(false);

  // Listen for chain changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleChainChanged = (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      const chain = CHAINS[chainId];
      setState(prev => ({
        ...prev,
        chainId,
        chainName: chain?.shortName || `Chain ${chainId}`,
        isSupported: SUPPORTED_CHAIN_IDS.includes(chainId),
      }));
    };

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Disconnected
        setState({
          connected: false,
          address: '',
          chainId: null,
          walletType: '',
          chainName: '',
          isSupported: false,
        });
      } else {
        setState(prev => ({ ...prev, address: accounts[0] }));
      }
    };

    window.ethereum.on?.('chainChanged', handleChainChanged);
    window.ethereum.on?.('accountsChanged', handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
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
      // Could not detect chain
    }

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
    setState({
      connected: false,
      address: '',
      chainId: null,
      walletType: '',
      chainName: '',
      isSupported: false,
    });
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
