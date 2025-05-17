
"use client";

import { useEffect, useMemo } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { addProduct, updateProduct } from '@/lib/actions';
import type { Product, Brand, Size } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
// Removed Select imports as it's no longer used for brand
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save } from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  product?: Product;
  brands: Brand[]; // Still needed for initial brand name lookup if editing
  availableSizes: Size[];
}

const initialState: { message: string | null; errors: any | null; success: boolean | null } = {
  message: null,
  errors: null,
  success: null,
};

export function ProductForm({ product, brands, availableSizes }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const actionToUse = product ? updateProduct.bind(null, product.id) : addProduct;
  const [state, formAction, isPending] = useActionState(actionToUse, initialState);

  const defaultSelectedSizes = useMemo(() => {
    return product?.sizes || [];
  }, [product?.sizes]);

  const initialBrandName = useMemo(() => {
    if (product && product.brandId && brands.length > 0) {
      return brands.find(b => b.id === product.brandId)?.name || '';
    }
    return '';
  }, [product, brands]);

  useEffect(() => {
    if (state?.message) {
      if (state.errors || !state.success) {
        toast({
          title: `Ошибка ${product ? 'обновления' : 'добавления'}`,
          description: state.message,
          variant: "destructive",
        });
      } else if (state.success) {
        toast({
          title: "Успех!",
          description: state.message,
        });
        router.push('/admin/products');
      }
    }
  }, [state, toast, router, product]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>{product ? "Редактировать товар" : "Добавить новый товар"}</CardTitle>
          <CardDescription>
            {product ? "Обновите детали этого товара." : "Заполните информацию о новом товаре."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Название товара</Label>
            <Input id="name" name="name" defaultValue={product?.name} required />
            {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description">Описание</Label>
            <Textarea id="description" name="description" defaultValue={product?.description} rows={4} required />
            {state?.errors?.description && <p className="text-sm text-destructive">{state.errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-3">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input id="price" name="price" type="number" step="0.01" defaultValue={product?.price} required />
              {state?.errors?.price && <p className="text-sm text-destructive">{state.errors.price[0]}</p>}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="discount">Скидка (%)</Label>
              <Input id="discount" name="discount" type="number" step="1" min="0" max="100" defaultValue={product?.discount || ''} placeholder="0" />
              {state?.errors?.discount && <p className="text-sm text-destructive">{state.errors.discount[0]}</p>}
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="brandName">Бренд</Label>
            <Input id="brandName" name="brandName" defaultValue={initialBrandName} required placeholder="Введите название бренда"/>
            {state?.errors?.brandName && <p className="text-sm text-destructive">{state.errors.brandName[0]}</p>}
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="image">URL изображения</Label>
            <Input id="image" name="image" type="url" defaultValue={product?.image} placeholder="https://placehold.co/600x800.png" />
            {state?.errors?.image && <p className="text-sm text-destructive">{state.errors.image[0]}</p>}
          </div>

          <div className="grid gap-3">
            <Label>Доступные размеры</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-3 border rounded-md">
              {availableSizes.map(size => (
                <div key={size.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size.id}`}
                    name="sizes"
                    value={size.id}
                    defaultChecked={defaultSelectedSizes.includes(size.id)}
                  />
                  <Label htmlFor={`size-${size.id}`} className="font-normal cursor-pointer">{size.name}</Label>
                </div>
              ))}
            </div>
            {state?.errors?.sizes && <p className="text-sm text-destructive">{state.errors.sizes[0]}</p>}
             {availableSizes.length === 0 && <p className="text-sm text-muted-foreground">Сначала добавьте размеры в разделе "Фильтры".</p>}
          </div>

        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" asChild>
            <Link href="/admin/products">Отмена</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            <Save className="mr-2 h-4 w-4" /> 
            {isPending ? (product ? 'Сохранение...' : 'Добавление...') : (product ? "Сохранить товар" : "Добавить товар")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
