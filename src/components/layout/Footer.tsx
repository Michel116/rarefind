
import { SiteConfigData } from '@/config/site';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-center">
        <p className="text-sm text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} {SiteConfigData.name}. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
