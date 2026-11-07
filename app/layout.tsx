import type {Metadata, Viewport} from 'next';
import {Lora} from 'next/font/google';
import './globals.css';

const lora = Lora({subsets: ['latin'], style: ['normal', 'italic'], display: 'swap', variable: '--font-lora'});

const siteUrl = process.env.URL || 'https://littletails.press';
const description = 'Cozy watercolor storybook adventures starring Drizzy, a little French bulldog with a big heart.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Little Tails — Where the littlest adventures come to life',
  description,
  openGraph: {
    type: 'website',
    siteName: 'Little Tails',
    title: 'Little Tails — Where the littlest adventures come to life',
    description,
    images: [{url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'A cozy watercolor library with a glowing fireplace and Drizzy the French bulldog'}],
  },
  twitter: {card: 'summary_large_image'},
};

export const viewport: Viewport = {themeColor: '#241c15'};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={lora.variable}>
      <body>{children}</body>
    </html>
  );
}
