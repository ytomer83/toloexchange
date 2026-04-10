import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WalletProvider } from "@/context/WalletContext";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOLO | 0% Fee Crypto Swaps — Free Digital Asset Exchange",
  description: "TOLO is a digital currency exchange platform. Swap any crypto with 0% fees — completely free swaps on all currencies. Powered by Polarbit Solutions Limited, FINTRAC registered MSB.",
  keywords: "crypto swap, digital currency exchange, USDC, USDT, token swap, wallet connect",
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
        <WalletProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
