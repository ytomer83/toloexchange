'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, RefreshCw, Search, Copy, Check, QrCode, AlertTriangle, ChevronDown, ExternalLink, Wallet } from 'lucide-react';
import { formatPrice, SUPPORTED_NETWORKS } from '@/lib/api';
import { WalletPromoCard } from '@/components/PromoBanner';
import ConnectWalletModal from '@/components/ConnectWallet';

interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  price: number;
  change24h: number;
  image: string;
}

const mockAssets: WalletAsset[] = [
  { symbol: 'BTC', name: 'Bitcoin', balance: 0.5432, usdValue: 36614.23, price: 67432.12, change24h: 2.34, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { symbol: 'ETH', name: 'Ethereum', balance: 4.2156, usdValue: 14572.12, price: 3456.78, change24h: 1.87, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { symbol: 'USDT', name: 'Tether', balance: 10000.00, usdValue: 10000.00, price: 1.0, change24h: 0.01, image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
  { symbol: 'SOL', name: 'Solana', balance: 25.5, usdValue: 4394.67, price: 172.34, change24h: 4.21, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { symbol: 'BNB', name: 'BNB', balance: 3.2, usdValue: 1915.04, price: 598.45, change24h: -0.54, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
  { symbol: 'XRP', name: 'XRP', balance: 5000, usdValue: 2617.00, price: 0.5234, change24h: -1.23, image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png' },
  { symbol: 'ADA', name: 'Cardano', balance: 10000, usdValue: 4567.00, price: 0.4567, change24h: 3.45, image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
  { symbol: 'DOGE', name: 'Dogecoin', balance: 25000, usdValue: 3085.00, price: 0.1234, change24h: 5.67, image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png' },
];

type ModalType = 'deposit' | 'withdraw' | null;

export default function WalletPage() {
  const [hideBalance, setHideBalance] = useState(false);
  const [search, setSearch] = useState('');
  const [hideSmall, setHideSmall] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedAsset, setSelectedAsset] = useState<WalletAsset | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'overview' | 'deposit-history' | 'withdraw-history'>('overview');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState('');

  const handleWalletConnected = (walletType: string, address: string) => {
    setConnectedWallet(walletType);
    setConnectedAddress(address);
  };

  const totalBalance = mockAssets.reduce((sum, a) => sum + a.usdValue, 0);
  const totalChange = mockAssets.reduce((sum, a) => sum + a.usdValue * a.change24h / 100, 0);
  const totalChangePercent = (totalChange / totalBalance) * 100;

  const filtered = mockAssets.filter(a => {
    if (search && !a.symbol.toLowerCase().includes(search.toLowerCase()) && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (hideSmall && a.usdValue < 1) return false;
    return true;
  });

  const generateAddress = () => {
    const chars = '0123456789abcdef';
    return '0x' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const depositAddress = generateAddress();

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openDeposit = (asset: WalletAsset) => {
    setSelectedAsset(asset);
    const network = SUPPORTED_NETWORKS.find(n => n.symbol === asset.symbol);
    setSelectedNetwork(network?.networks[0] || 'ERC-20');
    setActiveModal('deposit');
  };

  const openWithdraw = (asset: WalletAsset) => {
    setSelectedAsset(asset);
    const network = SUPPORTED_NETWORKS.find(n => n.symbol === asset.symbol);
    setSelectedNetwork(network?.networks[0] || 'ERC-20');
    setWithdrawAddress('');
    setWithdrawAmount('');
    setActiveModal('withdraw');
  };

  const currentNetworks = selectedAsset ? SUPPORTED_NETWORKS.find(n => n.symbol === selectedAsset.symbol)?.networks || ['ERC-20'] : [];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-8">
        {/* Promo */}
        <WalletPromoCard />

        {/* Connect Wallet Section */}
        {!connectedWallet && (
          <div className="glass-card rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Connect Your Wallet to Deposit</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Connect Phantom, Solflare, MetaMask, or Trust Wallet to deposit crypto directly and claim your $500 bonus.
              </p>
            </div>
            <button
              onClick={() => setWalletModalOpen(true)}
              className="shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-black transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #facc15, #f97316)' }}
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>
          </div>
        )}

        {connectedWallet && (
          <div className="glass-card rounded-xl p-4 mb-6 flex items-center gap-3" style={{ borderLeft: '3px solid var(--green)' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-[var(--green)] animate-pulse" />
            <div className="flex-1">
              <span className="text-sm font-medium text-white capitalize">{connectedWallet}</span>
              <span className="text-xs text-[var(--text-muted)] ml-2 font-mono">{connectedAddress.slice(0, 8)}...{connectedAddress.slice(-6)}</span>
            </div>
            <button
              onClick={() => { setConnectedWallet(null); setConnectedAddress(''); }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--red)] transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Portfolio Overview */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm text-[var(--text-secondary)]">Total Balance</h2>
                <button onClick={() => setHideBalance(!hideBalance)} className="text-[var(--text-muted)] hover:text-white">
                  {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-3xl font-bold text-white">
                {hideBalance ? '••••••' : `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </div>
              {!hideBalance && (
                <div className={`text-sm mt-1 ${totalChange >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                  {totalChange >= 0 ? '+' : ''}${Math.abs(totalChange).toFixed(2)} ({totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%) 24h
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setSelectedAsset(mockAssets[0]); openDeposit(mockAssets[0]); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
              >
                <ArrowDownLeft className="w-4 h-4" /> Deposit
              </button>
              <button
                onClick={() => { setSelectedAsset(mockAssets[0]); openWithdraw(mockAssets[0]); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white border border-[var(--border)] hover:border-[var(--text-secondary)] transition-colors"
              >
                <ArrowUpRight className="w-4 h-4" /> Withdraw
              </button>
            </div>
          </div>

          {/* Quick allocation */}
          <div className="flex gap-1 rounded-lg overflow-hidden h-3">
            {mockAssets.slice(0, 5).map((asset) => {
              const pct = (asset.usdValue / totalBalance) * 100;
              return (
                <div
                  key={asset.symbol}
                  className="h-full"
                  style={{
                    width: `${pct}%`,
                    background: asset.symbol === 'BTC' ? '#f7931a' : asset.symbol === 'ETH' ? '#627eea' : asset.symbol === 'USDT' ? '#26a17b' : asset.symbol === 'SOL' ? '#9945ff' : '#f0b90b',
                  }}
                  title={`${asset.symbol}: ${pct.toFixed(1)}%`}
                />
              );
            })}
            <div className="h-full flex-1" style={{ background: 'var(--bg-tertiary)' }} />
          </div>
          <div className="flex gap-4 mt-2">
            {mockAssets.slice(0, 5).map((asset) => (
              <div key={asset.symbol} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    background: asset.symbol === 'BTC' ? '#f7931a' : asset.symbol === 'ETH' ? '#627eea' : asset.symbol === 'USDT' ? '#26a17b' : asset.symbol === 'SOL' ? '#9945ff' : '#f0b90b',
                  }}
                />
                {asset.symbol} {((asset.usdValue / totalBalance) * 100).toFixed(1)}%
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-[var(--border)]">
          {[
            { key: 'overview' as const, label: 'Assets' },
            { key: 'deposit-history' as const, label: 'Deposit History' },
            { key: 'withdraw-history' as const, label: 'Withdrawal History' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 text-sm font-medium transition-colors ${
                tab === t.key ? 'text-white tab-active' : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search assets..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[var(--border)] text-white outline-none"
                  style={{ background: 'var(--bg-secondary)' }}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideSmall}
                  onChange={(e) => setHideSmall(e.target.checked)}
                  className="rounded border-[var(--border)]"
                />
                Hide small balances
              </label>
            </div>

            {/* Assets Table */}
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-[var(--text-muted)] border-b border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                    <th className="text-left py-3 pl-4">Asset</th>
                    <th className="text-right py-3">Balance</th>
                    <th className="text-right py-3 hidden md:table-cell">Price</th>
                    <th className="text-right py-3 hidden md:table-cell">24h Change</th>
                    <th className="text-right py-3">USD Value</th>
                    <th className="text-right py-3 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((asset) => (
                    <tr key={asset.symbol} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-3">
                          <img src={asset.image} alt={asset.symbol} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="text-sm font-medium text-white">{asset.symbol}</div>
                            <div className="text-xs text-[var(--text-muted)]">{asset.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm text-white font-medium">
                        {hideBalance ? '••••' : asset.balance.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                      </td>
                      <td className="py-4 text-right text-sm text-[var(--text-secondary)] hidden md:table-cell">
                        ${formatPrice(asset.price)}
                      </td>
                      <td className={`py-4 text-right text-sm hidden md:table-cell ${asset.change24h >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </td>
                      <td className="py-4 text-right text-sm text-white font-medium">
                        {hideBalance ? '••••' : `$${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openDeposit(asset)}
                            className="px-3 py-1.5 text-xs font-medium text-[var(--accent)] border border-[var(--accent)] rounded-lg hover:bg-[var(--accent)] hover:text-black transition-all"
                          >
                            Deposit
                          </button>
                          <button
                            onClick={() => openWithdraw(asset)}
                            className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg hover:text-white hover:border-white transition-all"
                          >
                            Withdraw
                          </button>
                          <a
                            href={`/trade?pair=${asset.symbol}_USDT`}
                            className="px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-lg hover:text-white hover:border-white transition-all"
                          >
                            Trade
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {(tab === 'deposit-history' || tab === 'withdraw-history') && (
          <div className="glass-card rounded-xl p-12 text-center">
            <div className="text-[var(--text-muted)] text-sm">No {tab === 'deposit-history' ? 'deposit' : 'withdrawal'} history yet</div>
            <p className="text-xs text-[var(--text-muted)] mt-1">Your transactions will appear here</p>
          </div>
        )}
      </div>

      {/* Deposit Modal */}
      {activeModal === 'deposit' && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden" style={{ background: 'var(--bg-card)' }}>
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-semibold text-white">Deposit {selectedAsset.symbol}</h3>
              <button onClick={() => setActiveModal(null)} className="text-[var(--text-muted)] hover:text-white text-xl">&times;</button>
            </div>
            <div className="p-6">
              {/* Network Selection */}
              <div className="mb-4">
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Select Network</label>
                <div className="flex gap-2 flex-wrap">
                  {currentNetworks.map(net => (
                    <button
                      key={net}
                      onClick={() => setSelectedNetwork(net)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        selectedNetwork === net
                          ? 'text-white bg-[var(--accent)]'
                          : 'text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code placeholder */}
              <div className="flex justify-center mb-4">
                <div className="w-48 h-48 rounded-xl border border-[var(--border)] flex items-center justify-center" style={{ background: 'white' }}>
                  <QrCode className="w-32 h-32 text-gray-800" />
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Deposit Address</label>
                <div className="flex items-center gap-2 p-3 rounded-lg border border-[var(--border)]" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs text-white break-all flex-1 font-mono">{depositAddress}</span>
                  <button onClick={handleCopy} className="shrink-0 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-[var(--green)]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Connect Wallet Quick Deposit */}
              <div className="mb-4">
                <button
                  onClick={() => { setActiveModal(null); setWalletModalOpen(true); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #facc15, #f97316)' }}
                >
                  <Wallet className="w-4 h-4" />
                  Deposit via Connected Wallet
                </button>
                <p className="text-[10px] text-[var(--text-muted)] text-center mt-1.5">Quick deposit using Phantom, MetaMask, Solflare, or Trust Wallet</p>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[10px] text-[var(--text-muted)]">OR USE DEPOSIT ADDRESS</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              {/* Warnings */}
              <div className="p-3 rounded-lg flex gap-2 text-xs" style={{ background: 'rgba(240, 185, 11, 0.1)' }}>
                <AlertTriangle className="w-4 h-4 text-[var(--yellow)] shrink-0 mt-0.5" />
                <div className="text-[var(--text-secondary)]">
                  <p>Only send <strong className="text-white">{selectedAsset.symbol}</strong> on the <strong className="text-white">{selectedNetwork}</strong> network to this address. Sending any other asset may result in permanent loss.</p>
                  <p className="mt-1">Minimum deposit: 0.0001 {selectedAsset.symbol}</p>
                  <p>Expected arrival: 1-3 network confirmations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {activeModal === 'withdraw' && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-md rounded-2xl border border-[var(--border)] overflow-hidden" style={{ background: 'var(--bg-card)' }}>
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-semibold text-white">Withdraw {selectedAsset.symbol}</h3>
              <button onClick={() => setActiveModal(null)} className="text-[var(--text-muted)] hover:text-white text-xl">&times;</button>
            </div>
            <div className="p-6">
              {/* Network Selection */}
              <div className="mb-4">
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Select Network</label>
                <div className="flex gap-2 flex-wrap">
                  {currentNetworks.map(net => (
                    <button
                      key={net}
                      onClick={() => setSelectedNetwork(net)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        selectedNetwork === net
                          ? 'text-white bg-[var(--accent)]'
                          : 'text-[var(--text-secondary)] border border-[var(--border)] hover:border-[var(--text-secondary)]'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="text-xs text-[var(--text-secondary)] mb-2 block">Withdrawal Address</label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder="Enter recipient address..."
                  className="w-full px-4 py-3 rounded-lg text-sm border border-[var(--border)] text-white outline-none focus:border-[var(--accent)]"
                  style={{ background: 'var(--bg-secondary)' }}
                />
              </div>

              {/* Amount */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-[var(--text-secondary)]">Amount</label>
                  <span className="text-xs text-[var(--text-muted)]">Available: {selectedAsset.balance} {selectedAsset.symbol}</span>
                </div>
                <div className="flex items-center rounded-lg border border-[var(--border)] focus-within:border-[var(--accent)]" style={{ background: 'var(--bg-secondary)' }}>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
                  />
                  <button
                    onClick={() => setWithdrawAmount(selectedAsset.balance.toString())}
                    className="px-3 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                  >
                    MAX
                  </button>
                  <span className="pr-4 text-xs text-[var(--text-muted)]">{selectedAsset.symbol}</span>
                </div>
              </div>

              {/* Fee info */}
              <div className="p-3 rounded-lg text-xs space-y-1.5 mb-4" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Network Fee</span>
                  <span className="text-white">0.0005 {selectedAsset.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">You will receive</span>
                  <span className="text-white">
                    {withdrawAmount ? (parseFloat(withdrawAmount) - 0.0005).toFixed(8) : '0.00'} {selectedAsset.symbol}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="p-3 rounded-lg flex gap-2 text-xs mb-4" style={{ background: 'rgba(246, 70, 93, 0.1)' }}>
                <AlertTriangle className="w-4 h-4 text-[var(--red)] shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">
                  Please double-check the address and network. Withdrawals to wrong addresses cannot be recovered.
                </span>
              </div>

              <button
                disabled={!withdrawAddress || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
              >
                Withdraw {selectedAsset.symbol}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnected={handleWalletConnected}
      />
    </div>
  );
}
