
"use client";

import type { ReactNode } from 'react';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminSidebar, MobileAdminSidebarContents } from '@/components/layout/AdminSidebar';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Toaster } from '@/components/ui/toaster';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <Sheet>
          <AdminHeader /> 
          <SheetContent side="left" className="flex flex-col w-64 p-0 bg-background border-r sm:hidden">
            <MobileAdminSidebarContents />
          </SheetContent>
        </Sheet>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
