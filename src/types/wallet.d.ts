/* eslint-disable @typescript-eslint/no-explicit-any */

interface EthereumProvider {
  isMetaMask?: boolean;
  isTrust?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (...args: any[]) => void) => void;
}

interface Window {
  ethereum?: EthereumProvider;
  solana?: SolanaProvider;
  solflare?: SolanaProvider;
  phantom?: {
    solana?: SolanaProvider;
  };
}
