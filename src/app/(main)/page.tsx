"use client";

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';
import { mockProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SearchSlash } from 'lucide-react';

export default function ProductsPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>('Все бренды');
  const [selectedSize, setSelectedSize] = useState<string>('Все размеры');

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product: Product) => {
      const brandMatch = selectedBrand === 'Все бренды' || product.brand === selectedBrand;
      const sizeMatch = selectedSize === 'Все размеры' || product.size.includes(selectedSize);
      return brandMatch && sizeMatch;
    });
  }, [selectedBrand, selectedSize]);

  const handleResetFilters = () => {
    setSelectedBrand('Все бренды');
    setSelectedSize('Все размеры');
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-1/4 lg:w-1/5">
        <ProductFilters
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          onResetFilters={handleResetFilters}
        />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
        {filteredProducts.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-10rem)] pr-4"> {/* Adjust height as needed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10">
             <Alert className="max-w-md text-center">
              <SearchSlash className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
              <AlertTitle className="text-xl font-semibold">Товары не найдены</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                Попробуйте изменить фильтры или зайдите позже.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </section>
    </div>
  );
}
