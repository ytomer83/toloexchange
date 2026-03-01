'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Check, ArrowRight, Wallet, Shield, Zap, Gift, ChevronRight } from 'lucide-react';
import ConnectWalletModal from '@/components/ConnectWallet';

export default function RegisterPage() {
  const [step, setStep] = useState<'connect' | 'create-account'>('connect');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [connectedAddress, setConnectedAddress] = useState('');

  // Account form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase & lowercase', met: /[A-Z]/.test(password) && /[a-z]/.test(password) },
    { label: 'Number & special character', met: /\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allChecksMet = passwordChecks.every(c => c.met);

  const handleWalletConnected = (walletType: string, address: string) => {
    setConnectedWallet(walletType);
    setConnectedAddress(address);
    setStep('create-account');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setAccountCreated(true);
  };

  // Account created success screen
  if (accountCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(14, 203, 129, 0.2), rgba(0, 180, 216, 0.2))', border: '2px solid rgba(14, 203, 129, 0.3)' }}>
            <Check className="w-10 h-10 text-[var(--green)]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to TOLO!</h1>
          <p className="text-[var(--text-secondary)] mb-2">
            Your account has been created and wallet connected.
          </p>
          {connectedWallet && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-[var(--green)] mb-6" style={{ background: 'rgba(14, 203, 129, 0.1)', border: '1px solid rgba(14, 203, 129, 0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
              {connectedAddress.slice(0, 8)}...{connectedAddress.slice(-6)}
            </div>
          )}

          {/* Bonus card */}
          <div className="glass-card rounded-2xl p-6 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(249, 115, 22, 0.2))' }}>
                <Gift className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">$500 Trading Bonus Awaits!</h3>
                <p className="text-xs text-[var(--text-secondary)]">Deposit $100 to claim your bonus</p>
              </div>
            </div>
            <Link
              href="/wallet"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #facc15, #f97316)' }}
            >
              <Wallet className="w-4 h-4" /> Deposit Now & Get $500
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/trade"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
            >
              Start Trading <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/wallet"
              className="w-full py-3 rounded-xl text-sm font-medium text-[var(--text-secondary)] border border-[var(--border)] hover:text-white hover:border-[var(--text-secondary)] transition-all"
            >
              Go to Wallet
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}>
              <img src="/logo.png" alt="TOLO" className="w-10 h-10 object-cover" />
            </div>
            <span className="text-2xl font-bold text-white">TOLO</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Get Started with TOLO</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Connect your wallet and start trading in seconds</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-xs font-medium ${step === 'connect' ? 'text-white' : 'text-[var(--green)]'}`} style={{ background: step === 'connect' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(14, 203, 129, 0.1)', border: `1px solid ${step === 'connect' ? 'rgba(0, 180, 216, 0.3)' : 'rgba(14, 203, 129, 0.2)'}` }}>
            {connectedWallet ? <Check className="w-3.5 h-3.5 text-[var(--green)]" /> : <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(0, 180, 216, 0.3)' }}>1</span>}
            Connect Wallet
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg text-xs font-medium ${step === 'create-account' ? 'text-white' : 'text-[var(--text-muted)]'}`} style={{ background: step === 'create-account' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${step === 'create-account' ? 'rgba(0, 180, 216, 0.3)' : 'rgba(255,255,255,0.06)'}` }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: step === 'create-account' ? 'rgba(0, 180, 216, 0.3)' : 'rgba(255,255,255,0.06)' }}>2</span>
            Create Account
          </div>
        </div>

        {/* Step 1: Connect Wallet */}
        {step === 'connect' && (
          <div className="glass-card rounded-2xl p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(192, 38, 211, 0.15))' }}>
                <Wallet className="w-8 h-8 text-[var(--accent)]" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Connect Your Wallet</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Link your crypto wallet to get started. No sign-up needed to deposit.
              </p>
            </div>

            <button
              onClick={() => setWalletModalOpen(true)}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:scale-[1.01] mb-4"
              style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
            >
              <Wallet className="w-4 h-4" /> Connect Wallet
            </button>

            <div className="flex items-center gap-2 justify-center mb-4">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[10px] text-[var(--text-muted)]">SUPPORTED WALLETS</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'MetaMask', icon: '🦊' },
                { name: 'Phantom', icon: '👻' },
                { name: 'Trust Wallet', icon: '🛡️' },
                { name: 'Solflare', icon: '☀️' },
              ].map(w => (
                <button
                  key={w.name}
                  onClick={() => setWalletModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs text-[var(--text-secondary)] hover:text-white transition-all hover:bg-[var(--bg-tertiary)]"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-base">{w.icon}</span> {w.name}
                </button>
              ))}
            </div>

            {/* Benefits */}
            <div className="mt-6 pt-4 border-t border-[var(--border)] space-y-2.5">
              {[
                { icon: Zap, text: 'Deposit & trade immediately' },
                { icon: Gift, text: 'Get $500 bonus on $100 deposit' },
                { icon: Shield, text: 'VASP licensed & regulated' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Create Account (optional, after wallet connect) */}
        {step === 'create-account' && (
          <div className="glass-card rounded-2xl p-6">
            {/* Wallet connected indicator */}
            {connectedWallet && (
              <div className="flex items-center gap-2 p-3 rounded-lg mb-5" style={{ background: 'rgba(14, 203, 129, 0.08)', border: '1px solid rgba(14, 203, 129, 0.15)' }}>
                <div className="w-2 h-2 rounded-full bg-[var(--green)] animate-pulse" />
                <span className="text-xs font-medium text-[var(--green)] capitalize">{connectedWallet} Connected</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono ml-auto">{connectedAddress.slice(0, 8)}...{connectedAddress.slice(-4)}</span>
              </div>
            )}

            <h2 className="text-base font-semibold text-white mb-1">Create Your Account</h2>
            <p className="text-xs text-[var(--text-secondary)] mb-5">Optional but recommended to secure your funds and enable full features.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                  <User className="w-4 h-4 text-[var(--text-muted)] ml-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                  <Mail className="w-4 h-4 text-[var(--text-muted)] ml-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                  <Lock className="w-4 h-4 text-[var(--text-muted)] ml-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-3 text-[var(--text-muted)] hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {passwordChecks.map(check => (
                      <div key={check.label} className="flex items-center gap-1 text-[10px]">
                        <Check className={`w-2.5 h-2.5 ${check.met ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'}`} />
                        <span className={check.met ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'}>{check.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[var(--border)]"
                />
                <span className="text-[11px] text-[var(--text-secondary)]">
                  I agree to the{' '}
                  <Link href="/legal/terms" className="text-[var(--accent)] hover:underline">Terms</Link>,{' '}
                  <Link href="/legal/privacy" className="text-[var(--accent)] hover:underline">Privacy</Link>, and{' '}
                  <Link href="/legal/aml" className="text-[var(--accent)] hover:underline">AML Policy</Link>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !allChecksMet || !agreeTerms || !fullName || !email}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Skip to deposit directly */}
            <div className="mt-4 text-center">
              <Link href="/wallet" className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                Skip — go straight to deposit →
              </Link>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
            Sign In
          </Link>
        </p>
      </div>

      <ConnectWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnected={handleWalletConnected}
      />
    </div>
  );
}
