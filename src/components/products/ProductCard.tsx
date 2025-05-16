"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || '');
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize && product.availableSizes.length > 0 && product.availableSizes[0] !== 'Единый размер') {
      toast({
        title: "Выберите размер",
        description: `Пожалуйста, выберите размер для ${product.name}.`,
        variant: "destructive",
      });
      return;
    }
    addToCart(product, selectedSize || 'Единый размер');
  };
  
  const isInCart = cartItems.some(item => item.id === product.id && item.selectedSize === selectedSize);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="aspect-[4/5] w-full overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={500}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-semibold mb-1 truncate" title={product.name}>{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-1">{product.brand}</CardDescription>
        <p className="text-lg font-bold text-primary">{product.price.toFixed(2)} ₽</p>
        {product.availableSizes.length > 0 && product.availableSizes[0] !== 'Единый размер' && (
          <div className="mt-2">
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full text-sm h-9">
                <SelectValue placeholder="Выберите размер" />
              </SelectTrigger>
              <SelectContent>
                {product.availableSizes.map(size => (
                  <SelectItem key={size} value={size} className="text-sm">
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={isInCart || (product.availableSizes.length > 0 && product.availableSizes[0] !== 'Единый размер' && !selectedSize)}
          aria-label={`Добавить ${product.name} в корзину`}
        >
          {isInCart ? <CheckCircle className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
          {isInCart ? 'Добавлено' : 'В корзину'}
        </Button>
      </CardFooter>
    </Card>
  );
}
