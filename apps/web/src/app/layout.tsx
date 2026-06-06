import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Hanken_Grotesk } from 'next/font/google';
import './globals.css';

const sans = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-app',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Argus — Attack Surface Management',
  description: 'Continuous attack surface discovery and monitoring.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">{children}</body>
    </html>
  );
}
