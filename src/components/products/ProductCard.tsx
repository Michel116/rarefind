
"use client";

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SiteConfigData } from '@/config/site';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  brandName: string;
}

export function ProductCard({ product, brandName }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const placeholderText = "Фото нет, скоро добавим.";

  return (
    <Dialog>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0 relative">
          <DialogTrigger asChild>
            <div className="aspect-[3/4] w-full relative group cursor-pointer">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="fashion clothing"
                />
              ) : (
                <div className="aspect-[3/4] w-full flex items-center justify-center bg-muted border border-dashed rounded-t-lg p-4 text-center text-muted-foreground">
                  <span>{placeholderText}</span>
                </div>
              )}
              {product.discount && product.discount > 0 && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  -{product.discount}%
                </Badge>
              )}
            </div>
          </DialogTrigger>
        </CardHeader>
        
        <CardContent className="p-4 flex-grow">
          <DialogTrigger asChild>
            <CardTitle className="text-lg font-semibold mb-1 truncate cursor-pointer hover:underline" title={product.name}>
              {product.name}
            </CardTitle>
          </DialogTrigger>
          <p className="text-sm text-muted-foreground mb-2">{brandName}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold text-primary">
              {Math.round(discountedPrice).toLocaleString('ru-RU')} {SiteConfigData.currency}
            </p>
            {product.discount && product.discount > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                {product.price.toLocaleString('ru-RU')} {SiteConfigData.currency}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
          <DialogTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full"
            )}
          >
            <Eye className="mr-2 h-4 w-4" /> Подробнее
          </DialogTrigger>
          <Button onClick={handleAddToCart} className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
          </Button>
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>Бренд: {brandName}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-md"
                data-ai-hint="fashion clothing detail"
              />
            ) : (
              <div className="aspect-[3/4] w-full flex items-center justify-center bg-muted border border-dashed rounded-md p-4 text-center text-muted-foreground">
                <span>{placeholderText}</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold">
              {Math.round(discountedPrice).toLocaleString('ru-RU')} {SiteConfigData.currency}
            </span>
            {product.discount && product.discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {product.price.toLocaleString('ru-RU')} {SiteConfigData.currency}
              </span>
            )}
          </div>
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h4 className="font-medium mb-1">Доступные размеры:</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(sizeId => (
                  <Badge key={sizeId} variant="secondary">{sizeId.toUpperCase()}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Закрыть</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> В корзину
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
