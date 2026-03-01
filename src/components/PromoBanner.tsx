'use client';

import Link from 'next/link';
import { Gift, ArrowRight, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export function PromoStrip() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(90deg, #00b4d8, #7c3aed, #c026d3, #00b4d8)', backgroundSize: '200% 100%', animation: 'gradientShift 6s ease infinite' }}>
      <style jsx>{`@keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }`}</style>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-center gap-3">
        <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
        <p className="text-sm font-semibold text-white text-center">
          Limited Time: Deposit $100 and get a <span className="text-yellow-300">$500 Trading Bonus!</span>
        </p>
        <Link
          href="/wallet"
          className="shrink-0 px-3 py-1 text-xs font-bold text-black bg-yellow-300 rounded-full hover:bg-yellow-200 transition-colors"
        >
          Claim Now
        </Link>
        <button onClick={() => setVisible(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function PromoCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #0d1229 40%, #120a20 100%)' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glow orbs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-[100px]" style={{ background: '#c026d3' }} />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full opacity-20 blur-[100px]" style={{ background: '#00b4d8' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]" style={{ background: '#7c3aed' }} />
        {/* Floating particles */}
        <style jsx>{`
          @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(180deg)} }
          @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(-180deg)} }
          @keyframes float3 { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-25px) scale(1.2)} }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          @keyframes countUp { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
          @keyframes pulseRing { 0%{transform:scale(0.95);opacity:0.5} 50%{transform:scale(1.05);opacity:0.8} 100%{transform:scale(0.95);opacity:0.5} }
        `}</style>
        <div className="absolute top-8 right-[20%] w-2 h-2 rounded-full bg-cyan-400/20" style={{ animation: 'float1 6s ease-in-out infinite' }} />
        <div className="absolute bottom-12 right-[30%] w-1.5 h-1.5 rounded-full bg-purple-400/20" style={{ animation: 'float2 8s ease-in-out infinite 1s' }} />
        <div className="absolute top-[40%] left-[15%] w-1 h-1 rounded-full bg-cyan-300/30" style={{ animation: 'float3 7s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-8 left-[40%] w-1.5 h-1.5 rounded-full bg-purple-300/15" style={{ animation: 'float1 9s ease-in-out infinite 0.5s' }} />
      </div>

      <div className="relative z-10 p-6 sm:p-8 md:p-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase mb-5" style={{ background: 'linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(192, 38, 211, 0.15))', border: '1px solid rgba(0, 180, 216, 0.25)', backdropFilter: 'blur(10px)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="gradient-text">Limited Time Bonus</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold text-white leading-tight mb-3 tracking-tight">
              Deposit <span className="text-cyan-400">$100</span>,{' '}
              <br className="hidden sm:block" />
              Trade with{' '}
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}>
                $500
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] mb-6 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Get an instant <span className="text-white font-medium">5x trading bonus</span> on your first deposit. Connect your wallet, deposit any crypto, and start trading with amplified capital.
            </p>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-7">
              {[
                { icon: '⚡', text: 'Instant Credit' },
                { icon: '🔒', text: 'Secure & Regulated' },
                { icon: '💰', text: 'Withdraw Profits' },
                { icon: '🌐', text: '200+ Tokens' },
              ].map((chip) => (
                <div
                  key={chip.text}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-sm">{chip.icon}</span>
                  {chip.text}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/wallet"
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold text-white rounded-xl transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(0,180,216,0.3)] overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #00b4d8, #7c3aed, #c026d3)' }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #00d4e8, #8b5cf6, #d946ef)' }} />
                <span className="relative">Claim Your Bonus</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-[var(--text-secondary)] hover:text-white rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right visual — animated bonus card */}
          <div className="shrink-0 relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.2), rgba(192,38,211,0.2))', filter: 'blur(30px)', animation: 'pulseRing 4s ease-in-out infinite' }} />

            {/* Main card */}
            <div className="relative w-[260px] sm:w-[300px] rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', backgroundSize: '200% 100%', animation: 'shimmer 3s ease-in-out infinite' }} />

              <div className="relative p-6 sm:p-8">
                {/* Top label */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00b4d8, #c026d3)' }}>
                      <Gift className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Bonus</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Active</span>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-center mb-6" style={{ animation: 'countUp 0.8s ease-out' }}>
                  <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">You Receive</div>
                  <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text leading-none" style={{ backgroundImage: 'linear-gradient(135deg, #00b4d8, #7c3aed, #c026d3)' }}>
                    $500
                  </div>
                  <div className="text-sm font-bold text-white/50 mt-2">Trading Bonus</div>
                </div>

                {/* Progress / multiplier */}
                <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-white/40">Your Deposit</span>
                    <span className="text-[11px] font-bold text-white">$100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: '100%', background: 'linear-gradient(90deg, #00b4d8, #c026d3)' }} />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-white/40">Multiplier</span>
                    <span className="text-[11px] font-extrabold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #00b4d8, #c026d3)' }}>5x Bonus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WalletPromoCard() {
  return (
    <div className="rounded-xl p-5 mb-6 flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.08), rgba(249, 115, 22, 0.08))', border: '1px solid rgba(250, 204, 21, 0.2)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.2), rgba(249, 115, 22, 0.2))' }}>
        <Gift className="w-6 h-6 text-yellow-400" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-white">Deposit $100, Get $500 Bonus!</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">Connect your wallet and deposit to claim your bonus instantly.</p>
      </div>
      <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 animate-pulse" />
    </div>
  );
}
