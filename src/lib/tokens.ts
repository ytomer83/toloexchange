// ========================================
// Token & Chain Configuration
// Real mainnet contract addresses
// ========================================

export interface ChainConfig {
  chainId: number;
  chainIdHex: string;
  name: string;
  shortName: string;
  rpcUrl: string;
  explorer: string;
  explorerName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const CHAINS: Record<number, ChainConfig> = {
  1: {
    chainId: 1,
    chainIdHex: '0x1',
    name: 'Ethereum Mainnet',
    shortName: 'Ethereum',
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    explorerName: 'Etherscan',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  56: {
    chainId: 56,
    chainIdHex: '0x38',
    name: 'BNB Smart Chain',
    shortName: 'BSC',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorer: 'https://bscscan.com',
    explorerName: 'BscScan',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  },
  137: {
    chainId: 137,
    chainIdHex: '0x89',
    name: 'Polygon',
    shortName: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    explorerName: 'PolygonScan',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  },
  42161: {
    chainId: 42161,
    chainIdHex: '0xa4b1',
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io',
    explorerName: 'Arbiscan',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  10: {
    chainId: 10,
    chainIdHex: '0xa',
    name: 'Optimism',
    shortName: 'Optimism',
    rpcUrl: 'https://mainnet.optimism.io',
    explorer: 'https://optimistic.etherscan.io',
    explorerName: 'Optimism Explorer',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
  43114: {
    chainId: 43114,
    chainIdHex: '0xa86a',
    name: 'Avalanche C-Chain',
    shortName: 'Avalanche',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorer: 'https://snowtrace.io',
    explorerName: 'SnowTrace',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  },
  8453: {
    chainId: 8453,
    chainIdHex: '0x2105',
    name: 'Base',
    shortName: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    explorerName: 'BaseScan',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  },
};

export const SUPPORTED_CHAIN_IDS = Object.keys(CHAINS).map(Number);

// ========================================
// Token definitions with contract addresses
// NATIVE = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
// ========================================

export const NATIVE_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

export interface TokenConfig {
  symbol: string;
  name: string;
  icon: string;
  image: string; // URL to token logo
  color: string;
  decimals: number; // default decimals
  popular?: boolean;
  // chainId -> contract address (NATIVE_ADDRESS for native tokens)
  addresses: Record<number, string>;
}

export const TOKENS: TokenConfig[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'Ξ',
    image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    color: '#627eea',
    decimals: 18,
    popular: true,
    addresses: {
      1: NATIVE_ADDRESS,
      42161: NATIVE_ADDRESS,
      10: NATIVE_ADDRESS,
      8453: NATIVE_ADDRESS,
    },
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '$',
    image: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
    color: '#2775ca',
    decimals: 6,
    popular: true,
    addresses: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      43114: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    },
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    icon: '₮',
    image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    color: '#26a17b',
    decimals: 6,
    popular: true,
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      42161: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
      10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      56: '0x55d398326f99059fF775485246999027B3197955',
      43114: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    },
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    icon: '◈',
    image: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
    color: '#f5ac37',
    decimals: 18,
    addresses: {
      1: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      137: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      42161: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
      10: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    icon: 'Ξ',
    image: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
    color: '#627eea',
    decimals: 18,
    addresses: {
      1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      137: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      42161: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      10: '0x4200000000000000000000000000000000000006',
    },
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    icon: '⬡',
    image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    color: '#f3ba2f',
    decimals: 18,
    popular: true,
    addresses: {
      56: NATIVE_ADDRESS,
    },
  },
  {
    symbol: 'POL',
    name: 'Polygon',
    icon: '⬡',
    image: 'https://assets.coingecko.com/coins/images/4713/small/polygon.png',
    color: '#8247e5',
    decimals: 18,
    addresses: {
      137: NATIVE_ADDRESS,
    },
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    icon: '▲',
    image: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
    color: '#e84142',
    decimals: 18,
    addresses: {
      43114: NATIVE_ADDRESS,
    },
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    icon: '⬡',
    image: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
    color: '#2a5ada',
    decimals: 18,
    addresses: {
      1: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      137: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
      42161: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
    },
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    icon: '🦄',
    image: 'https://assets.coingecko.com/coins/images/12504/small/uni.jpg',
    color: '#ff007a',
    decimals: 18,
    addresses: {
      1: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      137: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
      42161: '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0',
    },
  },
  {
    symbol: 'AAVE',
    name: 'Aave',
    icon: '👻',
    image: 'https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png',
    color: '#b6509e',
    decimals: 18,
    addresses: {
      1: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      137: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
    },
  },
  {
    symbol: 'ARB',
    name: 'Arbitrum',
    icon: '🔵',
    image: 'https://assets.coingecko.com/coins/images/16547/small/arb.jpg',
    color: '#28a0f0',
    decimals: 18,
    addresses: {
      42161: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    },
  },
  {
    symbol: 'OP',
    name: 'Optimism',
    icon: '🔴',
    image: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    color: '#ff0420',
    decimals: 18,
    addresses: {
      10: '0x4200000000000000000000000000000000000042',
    },
  },
];

// ========================================
// Helpers
// ========================================

/** Get tokens available on a specific chain */
export function getTokensForChain(chainId: number): TokenConfig[] {
  return TOKENS.filter(t => t.addresses[chainId]);
}

/** Get token by symbol */
export function getTokenBySymbol(symbol: string): TokenConfig | undefined {
  return TOKENS.find(t => t.symbol === symbol);
}

/** Check if token is native on a chain */
export function isNativeToken(token: TokenConfig, chainId: number): boolean {
  return token.addresses[chainId] === NATIVE_ADDRESS;
}

/** Get contract address for a token on a chain */
export function getTokenAddress(token: TokenConfig, chainId: number): string | null {
  return token.addresses[chainId] || null;
}

/** Get explorer TX URL */
export function getExplorerTxUrl(chainId: number, txHash: string): string {
  const chain = CHAINS[chainId];
  if (!chain) return '#';
  return `${chain.explorer}/tx/${txHash}`;
}

/** Get explorer address URL */
export function getExplorerAddressUrl(chainId: number, address: string): string {
  const chain = CHAINS[chainId];
  if (!chain) return '#';
  return `${chain.explorer}/address/${address}`;
}
