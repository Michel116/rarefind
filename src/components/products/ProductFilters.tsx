
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { availableBrands, getGlobalFilterableSizes } from '@/lib/data'; 
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductFiltersProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  onResetFilters: () => void;
}

export function ProductFilters({
  selectedBrand,
  onBrandChange,
  selectedSize,
  onSizeChange,
  onResetFilters
}: ProductFiltersProps) {
  const [availableFilterSizes, setAvailableFilterSizes] = useState<string[]>(['Все размеры']);

  useEffect(() => {
    // Load sizes from localStorage on component mount (client-side only)
    setAvailableFilterSizes(getGlobalFilterableSizes());
  }, []);

  return (
    <Card className="sticky top-20 shadow-md rounded-lg">
      <CardHeader className="pb-4 text-center">
        <CardTitle className="text-xl">
          Фильтры
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="brand-filter" className="text-md font-medium mb-2 block">Бренд</Label>
          <Select value={selectedBrand} onValueChange={onBrandChange}>
            <SelectTrigger id="brand-filter" className="w-full">
              <SelectValue placeholder="Выберите бренд" />
            </SelectTrigger>
            <SelectContent>
              {availableBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="size-filter" className="text-md font-medium mb-2 block">Размер</Label>
          <Select value={selectedSize} onValueChange={onSizeChange} disabled={availableFilterSizes.length <= 1 && availableFilterSizes[0] === 'Все размеры'}>
            <SelectTrigger id="size-filter" className="w-full">
              <SelectValue placeholder="Выберите размер" />
            </SelectTrigger>
            <SelectContent>
              {availableFilterSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={onResetFilters} aria-label="Сбросить фильтры" className="w-full">
            <X className="mr-1 h-4 w-4" /> Сбросить
        </Button>
      </CardContent>
    </Card>
  );
}
