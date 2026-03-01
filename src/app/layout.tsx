import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LiveTicker from "@/components/LiveTicker";
import { PromoStrip } from "@/components/PromoBanner";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOLO Exchange | Trade Crypto with Confidence",
  description: "TOLO is a VASP-licensed cryptocurrency exchange offering spot trading, swaps, and secure wallet management. Operated by Simha Fintech Sp. z o.o.",
  keywords: "crypto exchange, bitcoin, ethereum, trading, VASP, cryptocurrency",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`} style={{ background: 'var(--bg-primary)' }}>
        <PromoStrip />
        <Header />
        <LiveTicker />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
