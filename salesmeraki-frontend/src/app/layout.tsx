import './globals.css';
import type { Metadata } from 'next';
// Remove the Inter font import
import SessionProvider from '@/components/providers/SessionProvider';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { AccessibilityProvider } from '@/providers/AccessibilityProvider';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export const metadata: Metadata = {
  title: 'SalesMeraki - AI-Powered Sales Enablement',
  description: 'Transform your sales process with cutting-edge AI technology',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SalesMeraki',
  },
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
    url: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SkipToContent />
        <SessionProvider>
          <AccessibilityProvider>
            <CurrencyProvider>
              {children}
            </CurrencyProvider>
          </AccessibilityProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
