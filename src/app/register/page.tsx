'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'register' | 'verify'>('register');

  const passwordChecks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number', met: /\d/.test(password) },
    { label: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allChecksMet = passwordChecks.every(c => c.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep('verify');
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(192, 38, 211, 0.2))' }}>
            <Mail className="w-10 h-10 text-[var(--accent)]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            We&apos;ve sent a verification link to <strong className="text-white">{email}</strong>. Please check your inbox and click the link to activate your account.
          </p>
          <div className="glass-card rounded-2xl p-6 text-left">
            <h3 className="text-sm font-medium text-white mb-3">Didn&apos;t receive the email?</h3>
            <ul className="text-sm text-[var(--text-secondary)] space-y-2">
              <li className="flex items-start gap-2"><span className="text-[var(--accent)] mt-0.5">1.</span> Check your spam/junk folder</li>
              <li className="flex items-start gap-2"><span className="text-[var(--accent)] mt-0.5">2.</span> Make sure your email address is correct</li>
              <li className="flex items-start gap-2"><span className="text-[var(--accent)] mt-0.5">3.</span> Wait a few minutes and try again</li>
            </ul>
            <button className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-all">
              Resend Email
            </button>
          </div>
          <Link href="/login" className="inline-block mt-6 text-sm text-[var(--text-secondary)] hover:text-white">
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold text-white">Create Your Account</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Start trading in minutes</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Full Name</label>
              <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                <User className="w-4 h-4 text-[var(--text-muted)] ml-4" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none"
                  required
                />
              </div>
            </div>

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
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Password</label>
              <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                <Lock className="w-4 h-4 text-[var(--text-muted)] ml-4" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-[var(--text-muted)] hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map(check => (
                    <div key={check.label} className="flex items-center gap-1.5 text-xs">
                      <Check className={`w-3 h-3 ${check.met ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'}`} />
                      <span className={check.met ? 'text-[var(--green)]' : 'text-[var(--text-muted)]'}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-[var(--text-secondary)] mb-2 block">Confirm Password</label>
              <div className="flex items-center rounded-xl border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors" style={{ background: 'var(--bg-secondary)' }}>
                <Lock className="w-4 h-4 text-[var(--text-muted)] ml-4" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none"
                  required
                />
                {confirmPassword && (
                  <span className="pr-4">
                    {passwordsMatch
                      ? <Check className="w-4 h-4 text-[var(--green)]" />
                      : <span className="text-xs text-[var(--red)]">Mismatch</span>
                    }
                  </span>
                )}
              </div>
            </div>

            <label className="flex items-start gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 rounded border-[var(--border)]"
              />
              <span className="text-xs text-[var(--text-secondary)]">
                I agree to the{' '}
                <Link href="/legal/terms" className="text-[var(--accent)] hover:underline">Terms of Service</Link>,{' '}
                <Link href="/legal/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>, and{' '}
                <Link href="/legal/aml" className="text-[var(--accent)] hover:underline">AML Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !allChecksMet || !passwordsMatch || !agreeTerms}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
