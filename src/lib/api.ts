export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: { price: number[] };
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number;
}

export interface MarketTicker {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function fetchTopCryptos(count: number = 50): Promise<CryptoAsset[]> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1&sparkline=true&price_change_percentage=7d`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    return getDefaultCryptos();
  }
}

export async function fetchCryptoPrice(id: string): Promise<Record<string, { usd: number; usd_24h_change: number }>> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 15 } }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    return {};
  }
}

export async function fetchMarketChart(id: string, days: number = 7): Promise<{ prices: [number, number][] }> {
  try {
    const res = await fetch(
      `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  } catch {
    return { prices: [] };
  }
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  if (price >= 0.01) return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 8 });
}

export function formatVolume(vol: number): string {
  if (vol >= 1e12) return `$${(vol / 1e12).toFixed(2)}T`;
  if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `$${(vol / 1e3).toFixed(2)}K`;
  return `$${vol.toFixed(2)}`;
}

export function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toFixed(2)}`;
}

function getDefaultCryptos(): CryptoAsset[] {
  const defaults = [
    { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 67432.12, market_cap: 1325000000000, market_cap_rank: 1, total_volume: 28500000000, price_change_percentage_24h: 2.34, high_24h: 68100, low_24h: 66200, circulating_supply: 19600000, total_supply: 21000000 },
    { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3456.78, market_cap: 415000000000, market_cap_rank: 2, total_volume: 15200000000, price_change_percentage_24h: 1.87, high_24h: 3520, low_24h: 3380, circulating_supply: 120000000, total_supply: 120000000 },
    { id: 'tether', symbol: 'usdt', name: 'Tether', current_price: 1.00, market_cap: 95000000000, market_cap_rank: 3, total_volume: 52000000000, price_change_percentage_24h: 0.01, high_24h: 1.001, low_24h: 0.999, circulating_supply: 95000000000, total_supply: 95000000000 },
    { id: 'binancecoin', symbol: 'bnb', name: 'BNB', current_price: 598.45, market_cap: 92000000000, market_cap_rank: 4, total_volume: 1800000000, price_change_percentage_24h: -0.54, high_24h: 605, low_24h: 590, circulating_supply: 153000000, total_supply: 153000000 },
    { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 172.34, market_cap: 76000000000, market_cap_rank: 5, total_volume: 3200000000, price_change_percentage_24h: 4.21, high_24h: 175, low_24h: 165, circulating_supply: 440000000, total_supply: 580000000 },
    { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 0.5234, market_cap: 28000000000, market_cap_rank: 6, total_volume: 1200000000, price_change_percentage_24h: -1.23, high_24h: 0.535, low_24h: 0.515, circulating_supply: 54000000000, total_supply: 100000000000 },
    { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.4567, market_cap: 16000000000, market_cap_rank: 7, total_volume: 450000000, price_change_percentage_24h: 3.45, high_24h: 0.465, low_24h: 0.44, circulating_supply: 35000000000, total_supply: 45000000000 },
    { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.1234, market_cap: 17500000000, market_cap_rank: 8, total_volume: 780000000, price_change_percentage_24h: 5.67, high_24h: 0.127, low_24h: 0.118, circulating_supply: 142000000000, total_supply: 142000000000 },
    { id: 'polkadot', symbol: 'dot', name: 'Polkadot', current_price: 7.23, market_cap: 9800000000, market_cap_rank: 9, total_volume: 290000000, price_change_percentage_24h: -2.14, high_24h: 7.45, low_24h: 7.05, circulating_supply: 1350000000, total_supply: 1350000000 },
    { id: 'avalanche-2', symbol: 'avax', name: 'Avalanche', current_price: 35.67, market_cap: 13500000000, market_cap_rank: 10, total_volume: 560000000, price_change_percentage_24h: 1.92, high_24h: 36.2, low_24h: 34.8, circulating_supply: 378000000, total_supply: 720000000 },
  ];
  return defaults.map(d => ({
    ...d,
    image: `https://assets.coingecko.com/coins/images/1/large/bitcoin.png`,
    sparkline_in_7d: { price: Array.from({ length: 168 }, () => d.current_price * (0.95 + Math.random() * 0.1)) },
    price_change_percentage_7d_in_currency: d.price_change_percentage_24h * 2.5,
  }));
}

export const POPULAR_PAIRS = [
  { base: 'BTC', quote: 'USDT', id: 'bitcoin' },
  { base: 'ETH', quote: 'USDT', id: 'ethereum' },
  { base: 'SOL', quote: 'USDT', id: 'solana' },
  { base: 'BNB', quote: 'USDT', id: 'binancecoin' },
  { base: 'XRP', quote: 'USDT', id: 'ripple' },
  { base: 'ADA', quote: 'USDT', id: 'cardano' },
  { base: 'DOGE', quote: 'USDT', id: 'dogecoin' },
  { base: 'DOT', quote: 'USDT', id: 'polkadot' },
  { base: 'AVAX', quote: 'USDT', id: 'avalanche-2' },
  { base: 'MATIC', quote: 'USDT', id: 'matic-network' },
  { base: 'LINK', quote: 'USDT', id: 'chainlink' },
  { base: 'UNI', quote: 'USDT', id: 'uniswap' },
];

export const SUPPORTED_NETWORKS = [
  { name: 'Bitcoin', symbol: 'BTC', networks: ['Bitcoin'] },
  { name: 'Ethereum', symbol: 'ETH', networks: ['ERC-20', 'Arbitrum One', 'Optimism'] },
  { name: 'USDT', symbol: 'USDT', networks: ['ERC-20', 'TRC-20', 'BEP-20', 'SOL', 'Polygon'] },
  { name: 'USDC', symbol: 'USDC', networks: ['ERC-20', 'TRC-20', 'BEP-20', 'SOL', 'Polygon'] },
  { name: 'BNB', symbol: 'BNB', networks: ['BEP-20', 'BEP-2'] },
  { name: 'Solana', symbol: 'SOL', networks: ['Solana'] },
  { name: 'XRP', symbol: 'XRP', networks: ['XRP Ledger'] },
  { name: 'Cardano', symbol: 'ADA', networks: ['Cardano'] },
  { name: 'Dogecoin', symbol: 'DOGE', networks: ['Dogecoin'] },
  { name: 'Polkadot', symbol: 'DOT', networks: ['Polkadot'] },
];
