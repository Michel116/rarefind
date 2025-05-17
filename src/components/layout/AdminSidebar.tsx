
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Tag, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Logo } from '@/components/Logo'; 

const navItems = [
  { href: '/admin', label: 'Управление магазином', icon: Store },
  { href: '/admin/products', label: 'Товары', icon: ShoppingBag },
  { href: '/admin/filters', label: 'Фильтры', icon: Tag },
];

const adminLogoUrl = "https://i.pinimg.com/736x/25/d3/93/25d3934d80bc6b834f0b37050840a26e.jpg";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background sm:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo href="/admin" textClassName='text-lg' imageUrl={adminLogoUrl} />
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'justify-start mb-1',
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'bg-muted text-primary hover:bg-muted'
                  : 'hover:bg-muted/50',
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

export function MobileAdminSidebarContents() {
    const pathname = usePathname();
    return (
        <>
            <div className="flex h-16 items-center border-b px-6">
                 <Logo href="/admin" textClassName='text-lg' imageUrl={adminLogoUrl} />
            </div>
            <ScrollArea className="flex-1 py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map((item) => (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        'justify-start mb-1',
                        pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                        ? 'bg-muted text-primary hover:bg-muted'
                        : 'hover:bg-muted/50',
                    )}
                    >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.label}
                    </Link>
                ))}
                </nav>
            </ScrollArea>
             <div className="mt-auto p-4 border-t">
                <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/">
                        <Home className="mr-3 h-5 w-5" />
                        Вернуться на сайт
                    </Link>
                </Button>
            </div>
        </>
    );
}
