import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOLO | Swap Digital Assets Instantly",
  description: "TOLO is a digital currency exchange platform. Connect your wallet, swap assets with a flat 0.5% fee. Powered by Polarbit Solutions Limited, FINTRAC registered MSB.",
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
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
