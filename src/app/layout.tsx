
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { siteConfig } from '@/config/site';
import { CartProvider } from '@/context/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { SiteConfigData } from '@/config/site'; // Added for the floating button

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <CartProvider>
          {children}
          <Toaster />
          <Link href={SiteConfigData.supportLink} target="_blank" rel="noopener noreferrer" passHref>
            <Button
              variant="default" // Using default (primary) variant for better visibility
              className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full p-0 shadow-lg"
              aria-label="Меню чата"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </Link>
        </CartProvider>
      </body>
    </html>
  );
}
