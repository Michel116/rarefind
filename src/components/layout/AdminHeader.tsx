
"use client";

import Link from 'next/link';
import { Menu, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SheetTrigger } from '@/components/ui/sheet';

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between sm:justify-end">
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 sm:hidden" 
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Открыть/закрыть меню навигации</span>
        </Button>
      </SheetTrigger>
      
      <div className="flex w-full items-center justify-end sm:justify-between">
        <div className="hidden sm:flex">
          {/* Placeholder for search or other elements */}
        </div>
        
        <Button variant="outline" size="sm" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            На сайт
          </Link>
        </Button>
      </div>
    </header>
  );
}
