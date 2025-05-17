
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { Product, Brand, Size } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ProductFilters } from './ProductFilters';
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
  initialProducts: Product[];
  brands: Brand[];
  sizes: Size[];
}

export function ProductList({ initialProducts, brands, sizes }: ProductListProps) {
  const [filters, setFilters] = useState<{ brandId?: string; sizeId?: string }>({});
  const [isClientFilteringLoading, setIsClientFilteringLoading] = useState(false);

  const brandMap = useMemo(() => new Map(brands.map(b => [b.id, b.name])), [brands]);

  // When initialProducts prop changes (e.g., due to server-side data update),
  // reset any client-side filtering loading state.
  useEffect(() => {
    setIsClientFilteringLoading(false);
  }, [initialProducts]);

  // Продукты, отфильтрованные на основе текущих фильтров
  const filteredProducts = useMemo(() => {
    let productsToFilter = initialProducts || []; // Обеспечиваем, что initialProducts не null/undefined
    if (filters.brandId) {
      productsToFilter = productsToFilter.filter(p => p.brandId === filters.brandId);
    }
    if (filters.sizeId) {
      productsToFilter = productsToFilter.filter(p => p.sizes.includes(filters.sizeId!));
    }
    return productsToFilter;
  }, [initialProducts, filters]);

  // Эффект для симуляции загрузки при изменении фильтров на клиенте
  useEffect(() => {
    if (isClientFilteringLoading) { // This effect is specifically for the client-side filtering loading timeout
      const timer = setTimeout(() => {
        setIsClientFilteringLoading(false);
      }, 300); // Simulate network delay for filtering
      return () => clearTimeout(timer);
    }
  }, [isClientFilteringLoading]); // Only re-run when isClientFilteringLoading changes (and not on initialProducts change)

  const handleFilterChange = (newFilters: { brandId?: string; sizeId?: string }) => {
    setIsClientFilteringLoading(true);
    setFilters(newFilters);
  };

  const productsToDisplay = filteredProducts;

  return (
    <div>
      <ProductFilters brands={brands} sizes={sizes} onFilterChange={handleFilterChange} currentFilters={filters} />
      {isClientFilteringLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(productsToDisplay.length || 4)].map((_, i) => ( // Показываем скелетоны в количестве предыдущего списка или по умолчанию
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[300px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      ) : productsToDisplay.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-2">Товары не найдены</h2>
          <p className="text-muted-foreground">Попробуйте изменить фильтры или загляните позже.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {productsToDisplay.map((product) => (
            <ProductCard key={product.id} product={product} brandName={brandMap.get(product.brandId) || 'Неизвестный бренд'} />
          ))}
        </div>
      )}
    </div>
  );
}
