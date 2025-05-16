'use client';

import * as React from 'react'; // <--- ДОБАВЛЕНО ЗДЕСЬ
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Product } from '@/lib/types';

// Schema for form validation
const ProductFormSchema = z.object({
  name: z.string().min(3, { message: "Название должно содержать не менее 3 символов" }),
  brand: z.string().min(2, { message: "Бренд должен содержать не менее 2 символов" }),
  price: z.coerce.number().positive({ message: "Цена должна быть положительным числом" }),
  imageUrl: z.string().url({ message: "Введите действительный URL изображения" }),
  description: z.string().min(10, { message: "Описание должно содержать не менее 10 символов" }),
  size: z.string().min(1, {message: "Укажите хотя бы один размер для отображения (через запятую)"}),
  availableSizes: z.string().min(1, {message: "Укажите хотя бы один доступный размер (через запятую)"}),
  dataAiHint: z.string().optional().default(''),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormValues) => void;
  onCancel: () => void;
  initialData?: Partial<ProductFormValues & { id?: string }>; // id is not part of the form schema but can be in initialData
}

export function ProductForm({ onSubmit, onCancel, initialData }: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: initialData || {
      name: '',
      brand: '',
      price: 0,
      imageUrl: '',
      description: '',
      size: '',
      availableSizes: '',
      dataAiHint: '',
    },
  });

  // Reset form if initialData changes (e.g., when switching between edit and add)
  React.useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: '', brand: '', price: 0, imageUrl: '', description: '',
        size: '', availableSizes: '', dataAiHint: '',
      });
    }
  }, [initialData, form]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название товара</FormLabel>
              <FormControl>
                <Input placeholder="Например, Футболка 'Космос'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Бренд</FormLabel>
                <FormControl>
                  <Input placeholder="Например, RAREFIND Originals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Цена (₽)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Например, 2999.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL изображения</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormDescription>Ссылка на изображение товара.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание товара</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder="Подробное описание товара..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Размеры для отображения</FormLabel>
                <FormControl>
                  <Input placeholder="S, M, L, XL (через запятую)" {...field} />
                </FormControl>
                <FormDescription>Эти размеры будут показаны на карточке товара.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableSizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Доступные размеры для выбора</FormLabel>
                <FormControl>
                  <Input placeholder="S, M, L, XL, XXL (через запятую)" {...field} />
                </FormControl>
                <FormDescription>Эти размеры покупатель сможет выбрать при добавлении в корзину.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="dataAiHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подсказка для ИИ (для плейсхолдера)</FormLabel>
              <FormControl>
                <Input placeholder="Например, t-shirt model" {...field} />
              </FormControl>
              <FormDescription>Ключевые слова для генерации похожего изображения, если основное не загрузится (макс. 2 слова).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">
            {initialData?.id ? 'Сохранить изменения' : 'Добавить товар'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
