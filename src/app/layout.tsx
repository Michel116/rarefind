import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google'; // Using Inter as an example, Geist is also good
import './globals.css';
import { cn } from '@/lib/utils';
import { TelegramProvider } from '@/contexts/TelegramContext';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from '@/components/ui/toaster'; // Ensure Toaster is imported

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

// Original Geist setup from existing files
import { Geist, Geist_Mono } from 'next/font/google';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'RAREFIND',
  description: 'Современный магазин одежды для Telegram Mini Apps.',
  // Add viewport settings for better mobile experience in Mini Apps
  viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Recommended meta tags for Telegram Mini Apps */}
        <meta name="telegram-webapp-custom-header-buttons" content="true" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
         {/* Script for Telegram Web App SDK - typically provided by Telegram environment */}
        <script src="https://telegram.org/js/telegram-web-app.js"></script>
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
           geistSans.variable, geistMono.variable // Use Geist from original
          // fontSans.variable // Or use Inter if preferred
        )}
      >
        <TelegramProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
