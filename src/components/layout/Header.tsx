
"use client";

import Link from 'next/link';
import { ShoppingBag, UserCircle, Shirt, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTelegram } from '@/contexts/TelegramContext';
import { isUserAdmin } from '@/lib/adminAuth';
import { useEffect, useState } from 'react';

export function Header() {
  const { getItemCount } = useCart();
  const { user, webApp, isInitializing: isTelegramInitializing } = useTelegram();
  const pathname = usePathname();
  const itemCount = getItemCount();
  const [showAdminLink, setShowAdminLink] = useState(false);

  useEffect(() => {
    if (!isTelegramInitializing && user) {
      setShowAdminLink(isUserAdmin(user.id));
    } else if (!isTelegramInitializing && !user) {
      // Case where Telegram context is initialized but no user (e.g. outside Telegram)
      // Check if mock user (ID 123456789) would be admin (it is by default)
      // This allows seeing the Admin link in local dev if using mock data
      setShowAdminLink(isUserAdmin(123456789));
    } else {
        // Still initializing
        setShowAdminLink(false);
    }
  }, [user, isTelegramInitializing]);

  const navLinks = [
    { href: '/', label: 'Товары', icon: <Shirt className="h-5 w-5" /> },
    { href: '/cart', label: 'Корзина', icon: <ShoppingBag className="h-5 w-5" /> },
    { href: '/account', label: 'Аккаунт', icon: <UserCircle className="h-5 w-5" /> },
  ];

  // Conditionally add admin link if user is admin and not already in admin section
  if (showAdminLink && !pathname.startsWith('/admin')) {
    navLinks.push({ href: '/admin/products', label: 'Админ', icon: <ShieldCheck className="h-5 w-5" /> });
  }
  
  // If we are in an admin path, don't render this header, admin layout has its own.
  if (pathname.startsWith('/admin')) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 pl-4">
          <span className="text-xl font-bold tracking-tight text-primary">RAREFIND</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "flex flex-col h-auto items-center justify-center p-1 sm:p-2 sm:flex-row sm:gap-1.5 rounded-md",
                pathname === link.href
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={link.href}>
                {link.icon}
                <span className="text-xs sm:text-sm hidden sm:inline">{link.label}</span>
                {link.label === 'Корзина' && itemCount > 0 && (
                  <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
