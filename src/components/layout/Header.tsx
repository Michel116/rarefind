
"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, User as UserIcon, Settings } from 'lucide-react'; // Added Settings
import { Button, buttonVariants } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Sheet, SheetContent, SheetTrigger as MobileSheetTrigger } from "@/components/ui/sheet";
import { useCart } from '@/context/CartContext';
import { CartSheet } from '@/components/cart/CartSheet';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HeaderProps {
  logoUrl?: string | null;
}

export function Header({ logoUrl }: HeaderProps) {
  const { getItemCount, setIsCartOpen } = useCart();
  const itemCount = getItemCount();

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const navLinksContent = (
    <>
      <Button variant="ghost" onClick={handleCartClick} aria-label="Корзина" className="flex items-center relative">
        <ShoppingCart className="h-6 w-6" />
        <span className="ml-2">Корзина</span>
        {itemCount > 0 && (
          <Badge variant="destructive" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs leading-none h-auto">
            {itemCount}
          </Badge>
        )}
      </Button>
      <Button variant="ghost" asChild className="flex items-center">
        <Link href="/profile" aria-label="Личный кабинет">
          <UserIcon className="h-6 w-6" />
          <span className="ml-2">Профиль</span>
        </Link>
      </Button>
      <Button variant="ghost" asChild className="flex items-center">
        <Link href="/admin" aria-label="Админ панель">
          <Settings className="h-6 w-6" />
          <span className="ml-2">Админ</span>
        </Link>
      </Button>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4">
          <Logo href="/" className="mr-auto md:mr-0 md:flex-grow-0 md:pl-0" imageUrl={logoUrl} />

          <div className="hidden md:flex ml-auto items-center space-x-1">
            {navLinksContent}
          </div>
          
          <Sheet>
            <MobileSheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-auto md:hidden")}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </MobileSheetTrigger>
            <SheetContent side="right" className="w-[280px] p-6 md:hidden">
              <nav className="flex flex-col space-y-4 mt-6">
                {navLinksContent}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <CartSheet />
    </>
  );
}
