import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css'; // Global styles
import { CookieConsent } from '@/src/components/CookieConsent';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: 'Akidsy | Fun Educational Games, Videos & Coloring for Kids',
  description: 'The #1 ad-free platform for kids. Discover thousands of interactive coloring books, educational videos, and puzzles designed for early childhood development.',
  alternates: {
    canonical: 'https://www.akidsy.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fredoka.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
