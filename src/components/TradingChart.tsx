'use client';

import { useEffect, useRef, useState } from 'react';

interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

function generateCandlestickData(basePrice: number, count: number): ChartData[] {
  const data: ChartData[] = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = count; i >= 0; i--) {
    const time = now - i * 3600000;
    const change = (Math.random() - 0.48) * basePrice * 0.008;
    const open = price;
    price += change;
    const close = price;
    const high = Math.max(open, close) + Math.random() * basePrice * 0.003;
    const low = Math.min(open, close) - Math.random() * basePrice * 0.003;
    data.push({ time, open, high, low, close });
  }
  return data;
}

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

export default function TradingChart({ symbol, basePrice }: { symbol: string; basePrice: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeframe, setTimeframe] = useState('1H');
  const [chartData] = useState<ChartData[]>(() => generateCandlestickData(basePrice, 80));
  const [hoveredCandle, setHoveredCandle] = useState<ChartData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 60, bottom: 30, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    const prices = chartData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const candleWidth = Math.max(2, (chartWidth / chartData.length) * 0.7);
    const gap = chartWidth / chartData.length;

    // Grid lines
    ctx.strokeStyle = 'rgba(43, 49, 57, 0.5)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const price = maxPrice - (priceRange * i) / 5;
      ctx.fillStyle = '#5e6673';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(price.toFixed(2), width - padding.right + 5, y + 3);
    }

    // Candles
    chartData.forEach((d, i) => {
      const x = padding.left + i * gap + gap / 2;
      const isGreen = d.close >= d.open;

      const openY = padding.top + ((maxPrice - d.open) / priceRange) * chartHeight;
      const closeY = padding.top + ((maxPrice - d.close) / priceRange) * chartHeight;
      const highY = padding.top + ((maxPrice - d.high) / priceRange) * chartHeight;
      const lowY = padding.top + ((maxPrice - d.low) / priceRange) * chartHeight;

      // Wick
      ctx.strokeStyle = isGreen ? '#0ecb81' : '#f6465d';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      ctx.fillStyle = isGreen ? '#0ecb81' : '#f6465d';
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1);
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // Volume bars at bottom
    const maxVol = Math.max(...chartData.map((_, i) => Math.abs(chartData[i].close - chartData[i].open)));
    chartData.forEach((d, i) => {
      const x = padding.left + i * gap + gap / 2;
      const vol = Math.abs(d.close - d.open);
      const volHeight = (vol / (maxVol || 1)) * 30;
      const isGreen = d.close >= d.open;

      ctx.fillStyle = isGreen ? 'rgba(14, 203, 129, 0.2)' : 'rgba(246, 70, 93, 0.2)';
      ctx.fillRect(x - candleWidth / 2, height - padding.bottom - volHeight, candleWidth, volHeight);
    });

  }, [chartData, timeframe]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = { left: 10, right: 60 };
    const chartWidth = rect.width - padding.left - padding.right;
    const gap = chartWidth / chartData.length;
    const index = Math.floor((x - padding.left) / gap);
    if (index >= 0 && index < chartData.length) {
      setHoveredCandle(chartData[index]);
    }
  };

  const lastCandle = chartData[chartData.length - 1];
  const displayCandle = hoveredCandle || lastCandle;

  return (
    <div className="h-full flex flex-col">
      {/* Chart header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs rounded ${
                timeframe === tf
                  ? 'text-white bg-[var(--bg-tertiary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
        {displayCandle && (
          <div className="flex items-center gap-4 text-xs">
            <span className="text-[var(--text-muted)]">O <span className="text-white">{displayCandle.open.toFixed(2)}</span></span>
            <span className="text-[var(--text-muted)]">H <span className="text-white">{displayCandle.high.toFixed(2)}</span></span>
            <span className="text-[var(--text-muted)]">L <span className="text-white">{displayCandle.low.toFixed(2)}</span></span>
            <span className="text-[var(--text-muted)]">C <span className={displayCandle.close >= displayCandle.open ? 'text-[var(--green)]' : 'text-[var(--red)]'}>{displayCandle.close.toFixed(2)}</span></span>
          </div>
        )}
      </div>
      <div className="flex-1 p-2">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          style={{ minHeight: 300 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredCandle(null)}
        />
      </div>
    </div>
  );
}
