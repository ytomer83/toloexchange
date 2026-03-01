'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}>
              <img src="/logo.png" alt="TOLO" className="w-10 h-10 object-cover" />
            </div>
            <span className="text-2xl font-bold text-white">TOLO</span>
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-6">
          {!sent ? (
            <>
              <h1 className="text-xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Enter your email and we&apos;ll send you a reset link</p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="w-14 h-14 text-[var(--green)] mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-white mb-2">Check Your Email</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
            </div>
          )}
        </div>

        <Link href="/login" className="flex items-center justify-center gap-2 mt-6 text-sm text-[var(--text-secondary)] hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}
