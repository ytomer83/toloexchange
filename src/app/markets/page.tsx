'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Star, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import SparklineChart from '@/components/SparklineChart';
import { formatPrice, formatVolume, formatMarketCap, CryptoAsset } from '@/lib/api';

const categories = ['All', 'Favorites', 'New Listings', 'DeFi', 'Layer 1', 'Layer 2', 'Meme', 'Gaming'];

export default function MarketsPage() {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState<string>('market_cap_rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=7d'
        );
        if (res.ok) {
          const data = await res.json();
          setCryptos(data);
        }
      } catch {
        // Use empty array
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  let filtered = cryptos.filter((c) => {
    if (category === 'Favorites') return favorites.has(c.id);
    if (search) {
      return c.name.toLowerCase().includes(search.toLowerCase()) ||
             c.symbol.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  filtered.sort((a, b) => {
    const getValue = (c: CryptoAsset) => {
      switch (sortBy) {
        case 'price': return c.current_price;
        case 'change': return c.price_change_percentage_24h;
        case 'market_cap': return c.market_cap;
        case 'volume': return c.total_volume;
        default: return c.market_cap_rank;
      }
    };
    const aVal = getValue(a);
    const bVal = getValue(b);
    return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
  });

  const totalMarketCap = cryptos.reduce((sum, c) => sum + c.market_cap, 0);
  const totalVolume = cryptos.reduce((sum, c) => sum + c.total_volume, 0);
  const avgChange = cryptos.length > 0 ? cryptos.reduce((sum, c) => sum + c.price_change_percentage_24h, 0) / cryptos.length : 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Markets</h1>
          <p className="text-sm text-[var(--text-secondary)]">Real-time cryptocurrency prices and market data</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-card rounded-xl p-5">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Total Market Cap</div>
            <div className="text-xl font-bold text-white">{formatMarketCap(totalMarketCap)}</div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="text-sm text-[var(--text-secondary)] mb-1">24h Volume</div>
            <div className="text-xl font-bold text-white">{formatVolume(totalVolume)}</div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="text-sm text-[var(--text-secondary)] mb-1">Avg 24h Change</div>
            <div className={`text-xl font-bold flex items-center gap-1 ${avgChange >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {avgChange >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search coins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[var(--border)] focus:border-[var(--accent)] outline-none transition-colors text-white"
              style={{ background: 'var(--bg-secondary)' }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  category === cat
                    ? 'text-white'
                    : 'text-[var(--text-secondary)] hover:text-white border border-[var(--border)]'
                }`}
                style={category === cat ? { background: 'linear-gradient(135deg, #00b4d8, #c026d3)' } : { background: 'var(--bg-secondary)' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-[var(--text-muted)] border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                  <th className="text-left py-3 pl-4 w-8"></th>
                  <th className="text-left py-3 cursor-pointer" onClick={() => handleSort('market_cap_rank')}>
                    <span className="flex items-center gap-1"># <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-left py-3">Name</th>
                  <th className="text-right py-3 cursor-pointer" onClick={() => handleSort('price')}>
                    <span className="flex items-center justify-end gap-1">Price <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-right py-3 cursor-pointer" onClick={() => handleSort('change')}>
                    <span className="flex items-center justify-end gap-1">24h % <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-right py-3 hidden md:table-cell cursor-pointer" onClick={() => handleSort('market_cap')}>
                    <span className="flex items-center justify-end gap-1">Market Cap <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-right py-3 hidden lg:table-cell cursor-pointer" onClick={() => handleSort('volume')}>
                    <span className="flex items-center justify-end gap-1">Volume (24h) <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                  <th className="text-right py-3 hidden xl:table-cell">7D Chart</th>
                  <th className="text-right py-3 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b border-[var(--border)]">
                      <td colSpan={9} className="py-4">
                        <div className="h-4 rounded animate-pulse mx-4" style={{ background: 'var(--bg-tertiary)' }} />
                      </td>
                    </tr>
                  ))
                ) : (
                  filtered.map((crypto) => (
                    <tr key={crypto.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors group">
                      <td className="py-3.5 pl-4">
                        <button onClick={() => toggleFavorite(crypto.id)} className="text-[var(--text-muted)] hover:text-[var(--yellow)] transition-colors">
                          <Star className={`w-4 h-4 ${favorites.has(crypto.id) ? 'fill-[var(--yellow)] text-[var(--yellow)]' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3.5 text-sm text-[var(--text-secondary)]">{crypto.market_cap_rank}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={crypto.image} alt={crypto.name} className="w-7 h-7 rounded-full" />
                          <div>
                            <div className="text-sm font-medium text-white">{crypto.name}</div>
                            <div className="text-xs text-[var(--text-muted)]">{crypto.symbol.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-right text-sm font-medium text-white">${formatPrice(crypto.current_price)}</td>
                      <td className={`py-3.5 text-right text-sm font-medium ${crypto.price_change_percentage_24h >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                        {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h?.toFixed(2)}%
                      </td>
                      <td className="py-3.5 text-right text-sm text-[var(--text-secondary)] hidden md:table-cell">
                        {formatMarketCap(crypto.market_cap)}
                      </td>
                      <td className="py-3.5 text-right text-sm text-[var(--text-secondary)] hidden lg:table-cell">
                        {formatVolume(crypto.total_volume)}
                      </td>
                      <td className="py-3.5 text-right hidden xl:table-cell">
                        {crypto.sparkline_in_7d && (
                          <SparklineChart
                            data={crypto.sparkline_in_7d.price}
                            positive={crypto.price_change_percentage_24h >= 0}
                          />
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <Link
                          href={`/trade?pair=${crypto.symbol.toUpperCase()}_USDT`}
                          className="px-3 py-1.5 text-xs font-medium text-[var(--accent)] border border-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-black transition-all"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
