'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFa, setTwoFa] = useState('');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'credentials') {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setLoading(false);
      setStep('2fa');
    } else {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Sign in to your account</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handleSubmit}>
            {step === 'credentials' ? (
              <>
                <div className="mb-4">
                  <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Email Address</label>
                  <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                    <Mail className="w-4 h-4 text-[var(--text-muted)] ml-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-[var(--text-secondary)]">Password</label>
                    <Link href="/forgot-password" className="text-xs text-[var(--accent)] hover:text-[var(--accent-hover)]">Forgot?</Link>
                  </div>
                  <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                    <Lock className="w-4 h-4 text-[var(--text-muted)] ml-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="pr-4 text-[var(--text-muted)] hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(0, 180, 216, 0.1)' }}>
                    <Shield className="w-7 h-7 text-[var(--accent)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">Enter the 6-digit code from your authenticator app</p>
                </div>

                <div className="mb-6">
                  <div className="flex gap-2 justify-center">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-[var(--border)] text-white outline-none focus:border-[var(--accent)]"
                        style={{ background: 'var(--bg-secondary)' }}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && i < 5) {
                            const next = e.target.nextElementSibling as HTMLInputElement;
                            next?.focus();
                          }
                          const codes = twoFa.split('');
                          codes[i] = val;
                          setTwoFa(codes.join(''));
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || twoFa.length < 6}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-full mt-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-white"
                >
                  Back to login
                </button>
              </>
            )}
          </form>

          {step === 'credentials' && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs text-[var(--text-muted)]">OR</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-white hover:border-[var(--text-secondary)] transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--text-secondary)] hover:text-white hover:border-[var(--text-secondary)] transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                  Apple
                </button>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
