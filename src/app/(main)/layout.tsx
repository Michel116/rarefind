import type { PropsWithChildren } from 'react';
import { Header } from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6">
        {children}
      </main>
      <Toaster />
      {/* Optional Footer can be added here */}
      {/* <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} RAREFIND Mini. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}
