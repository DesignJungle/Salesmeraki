import './globals.css';
import type { Metadata } from 'next';
// Remove the Inter font import
import SessionProvider from '@/components/providers/SessionProvider';

export const metadata: Metadata = {
  title: 'SalesMeraki - AI-Powered Sales Enablement',
  description: 'Transform your sales process with cutting-edge AI technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
