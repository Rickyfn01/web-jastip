import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'JastipVIP — Personal Shopper Brand Ternama | 100% Original',
    template: '%s | JastipVIP',
  },
  description: 'Layanan Personal Shopper terpercaya untuk produk brand ternama dari jaringan MAP Group. Nike, Zara, Sephora, Adidas, Lacoste — 100% original, harga terbaik.',
  keywords: ['Jastip MAP Murah', 'Jastip Zara Original', 'Jastip Nike Diskon', 'Personal Shopper MAP', 'Jastip Sephora terpercaya'],
  openGraph: {
    title: 'JastipVIP — Titip Barang Brand Favoritmu, Harga Terbaik!',
    description: 'Personal Shopper premium untuk brand-brand ternama dari MAP Group. Proses mudah, 100% original, bergaransi.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'JastipVIP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JastipVIP — Personal Shopper Brand Ternama',
    description: 'Titip barang brand favoritmu dengan harga terbaik. 100% original dari MAP Store.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${inter.variable} ${manrope.variable} bg-zinc-950 text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
