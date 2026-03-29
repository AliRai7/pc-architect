import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'PC Architect - Interactive 3D PC Builder',
  description: 'Explore a high-end gaming PC in stunning 3D. Click components to view specifications and watch the explosion animation.',
  keywords: ['PC', '3D', 'gaming', 'hardware', 'interactive', 'RTX 4090', 'DDR5'],
  authors: [{ name: 'PC Architect' }],
  openGraph: {
    title: 'PC Architect - Interactive 3D PC Builder',
    description: 'Explore a high-end gaming PC in stunning 3D',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
