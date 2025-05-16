
'use client';

import type { PropsWithChildren } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard, ShieldAlert, Loader2, Users, Package } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { useTelegram } from '@/contexts/TelegramContext';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { isUserAdmin } from '@/lib/adminAuth'; 
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: PropsWithChildren) {
  const { user, isInitializing: isTelegramInitializing } = useTelegram();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  useEffect(() => {
    if (!isTelegramInitializing) {
      if (user && isUserAdmin(user.id)) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
        toast({
          title: 'Доступ запрещен',
          description: 'У вас нет прав для доступа к админ-панели. Перенаправление...',
          variant: 'destructive',
        });
        setTimeout(() => router.replace('/'), 1500);
      }
      setIsCheckingAccess(false);
    }
  }, [user, isTelegramInitializing, router, toast]);

  if (isCheckingAccess || isTelegramInitializing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Проверка доступа к админ-панели...</p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-destructive">Доступ запрещен</h1>
        <p className="text-muted-foreground max-w-md">
          У вас нет необходимых прав для просмотра этой страницы. Вы будете автоматически перенаправлены на главную страницу.
        </p>
      </div>
    );
  }
  
  const adminNavLinks = [
    { href: '/admin/products', label: 'Управление товарами', icon: <Package className="h-4 w-4" /> },
    { href: '/admin/users', label: 'Администраторы', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Админ-панель RAREFIND</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            На сайт
          </Link>
        </Button>
      </header>
      <nav className="border-b bg-background shadow-sm">
        <div className="container flex h-12 items-center gap-x-4 sm:gap-x-6 px-4 sm:px-6">
          {adminNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="flex-1 container py-6 sm:py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
