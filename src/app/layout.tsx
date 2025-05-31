import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

// PROJECT IMPORTS
import { Providers } from './providers';
import { ConfigProvider } from '@/contexts/ConfigContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Book Search App',
  description: 'Search and discover books',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider>
          <Providers>
            {children}
          </Providers>
        </ConfigProvider>
      </body>
    </html>
  );
}
