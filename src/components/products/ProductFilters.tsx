
"use client";

import type { Brand, Size } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface ProductFiltersProps {
  brands: Brand[];
  sizes: Size[];
  onFilterChange: (filters: { brandId?: string; sizeId?: string }) => void;
  currentFilters: { brandId?: string; sizeId?: string };
}

export function ProductFilters({ brands, sizes, onFilterChange, currentFilters }: ProductFiltersProps) {
  const handleBrandChange = (brandId: string) => {
    onFilterChange({ ...currentFilters, brandId: brandId === 'all' ? undefined : brandId });
  };

  const handleSizeChange = (sizeId: string) => {
    onFilterChange({ ...currentFilters, sizeId: sizeId === 'all' ? undefined : sizeId });
  };

  const clearFilters = () => {
    onFilterChange({});
  };
  
  const hasActiveFilters = currentFilters.brandId || currentFilters.sizeId;

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-lg border-2 border-border">
      <h2 className="text-xl font-semibold mb-2 text-center">Фильтры</h2>
      <p className="text-sm text-muted-foreground text-center mb-6">Подберите товары по нужным параметрам.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
        <div>
          <Label htmlFor="brand-filter" className="text-sm font-medium mb-2 block">Бренд</Label>
          <Select onValueChange={handleBrandChange} value={currentFilters.brandId || 'all'}>
            <SelectTrigger id="brand-filter" className="w-full">
              <SelectValue placeholder="Выберите бренд" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все бренды</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="size-filter" className="text-sm font-medium mb-2 block">Размер</Label>
          <Select onValueChange={handleSizeChange} value={currentFilters.sizeId || 'all'}>
            <SelectTrigger id="size-filter" className="w-full">
              <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все размеры</SelectItem>
              {sizes.map((size) => (
                <SelectItem key={size.id} value={size.id}>
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {hasActiveFilters && (
          <div className="md:col-span-2 flex justify-end">
             <Button variant="ghost" onClick={clearFilters} className="text-sm">
              <X className="mr-2 h-4 w-4" />
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
