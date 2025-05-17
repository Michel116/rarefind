
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductList } from '@/components/products/ProductList';
import { getProducts, getBrands, getSizes, getStoreSettings } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const dynamic = 'force-dynamic'; // Ensure the page is always dynamic

export default async function HomePage() {
  const storeSettings = await getStoreSettings();

  if (storeSettings.isStoreClosed) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header logoUrl={storeSettings.logoUrl} />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Alert className="max-w-lg text-center">
            <Info className="h-5 w-5 mx-auto mb-2" />
            <AlertTitle className="text-2xl font-semibold">Магазин временно закрыт</AlertTitle>
            <AlertDescription className="mt-2">
              Приносим извинения за неудобства. Мы проводим технические работы и скоро вернемся.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Если магазин открыт, загружаем и отображаем товары
  const products = await getProducts();
  const brands = await getBrands();
  const sizes = await getSizes();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header logoUrl={storeSettings.logoUrl} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">Наши товары</h1>
        <p className="text-muted-foreground text-center mb-8">Найдите свой идеальный образ в RAREFIND</p>
        <ProductList initialProducts={products} brands={brands} sizes={sizes} />
      </main>
      <Footer />
    </div>
  );
}
