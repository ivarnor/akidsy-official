import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css'; // Global styles
import { CookieConsent } from '@/src/components/CookieConsent';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: 'Akidsy - Creative Explorer',
  description: 'A fun and secure membership platform for kids.',
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
