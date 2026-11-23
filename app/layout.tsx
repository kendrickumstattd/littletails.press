import type {Metadata, Viewport} from 'next';
import {Lora} from 'next/font/google';
import './globals.css';

const lora = Lora({subsets: ['latin'], style: ['normal', 'italic'], display: 'swap', variable: '--font-lora'});

const siteUrl = process.env.URL || 'https://littletails.press';
const description = 'Cozy watercolor storybook adventures starring Drizzy, a little French bulldog with a big heart.';

const shareImage = {url: '/images/share-card.png', width: 1200, height: 630, alt: 'Little Tails Press: Drizzy the French bulldog in a scalloped golden frame'};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Little Tails — Where the littlest adventures come to life',
  description,
  openGraph: {
    type: 'website',
    siteName: 'Little Tails',
    title: 'Little Tails — Where the littlest adventures come to life',
    description,
    images: [shareImage],
  },
  twitter: {card: 'summary_large_image', images: [shareImage]},
};

export const viewport: Viewport = {themeColor: '#241c15'};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={lora.variable}>
      <body>{children}</body>
    </html>
  );
}
