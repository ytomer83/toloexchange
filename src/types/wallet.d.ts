/* eslint-disable @typescript-eslint/no-explicit-any */

interface EthereumProvider {
  isMetaMask?: boolean;
  isTrust?: boolean;
  isPhantom?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
  selectedAddress?: string | null;
}

interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey: import('@solana/web3.js').PublicKey | null;
  connect: () => Promise<{ publicKey: import('@solana/web3.js').PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: import('@solana/web3.js').Transaction) => Promise<{ signature: string }>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

interface Window {
  ethereum?: EthereumProvider;
  solana?: SolanaProvider;
  solflare?: SolanaProvider;
  phantom?: {
    solana?: SolanaProvider;
    ethereum?: EthereumProvider;
  };
}
