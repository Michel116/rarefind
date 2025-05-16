"use client";

import Image from 'next/image';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) { // Allow 0 to trigger removal in context if desired
      updateQuantity(item.id, item.selectedSize, newQuantity);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden shadow-sm rounded-lg">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden flex-shrink-0">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 96px, 112px"
            className="object-cover"
            data-ai-hint={item.dataAiHint}
          />
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <p className="text-sm text-muted-foreground">Бренд: {item.brand}</p>
          <p className="text-sm text-muted-foreground">Размер: {item.selectedSize}</p>
          <p className="text-md font-medium text-primary">{item.price.toFixed(2)} ₽</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0 flex-shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            aria-label="Уменьшить количество"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            className="h-8 w-12 text-center px-1"
            min="0"
            aria-label="Количество товара"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            aria-label="Увеличить количество"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive/80 h-8 w-8 flex-shrink-0"
          onClick={() => removeFromCart(item.id, item.selectedSize)}
          aria-label="Удалить товар"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
