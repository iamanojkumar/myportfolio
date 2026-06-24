import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Nav } from '../components/Nav';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio site with project list, detail pages, and admin editor.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
