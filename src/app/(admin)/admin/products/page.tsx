
'use client';

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { mockProducts, getGlobalFilterableSizes, setGlobalFilterableSizes } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search, XCircle, ShieldCheck, UserPlus, UserX } from 'lucide-react';
import { ProductForm, type ProductFormValues } from '@/components/admin/ProductForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { getAdminIds, addAdminId, removeAdminId } from '@/lib/adminAuth';

// Helper functions for string/array conversion
const stringToArray = (str: string): string[] => str.split(',').map(s => s.trim()).filter(s => s.length > 0);
const arrayToString = (arr: string[] | undefined): string => arr ? arr.join(', ') : '';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [managedFilterSizes, setManagedFilterSizes] = useState<string[]>([]);
  const [newFilterSize, setNewFilterSize] = useState('');

  const [adminUserIds, setAdminUserIds] = useState<number[]>([]);
  const [newAdminIdInput, setNewAdminIdInput] = useState('');

  useEffect(() => {
    setProducts(mockProducts);
    setManagedFilterSizes(getGlobalFilterableSizes());
    setAdminUserIds(getAdminIds());
  }, []);

  const handleAddProduct = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productToDelete.id));
      toast({ title: 'Товар удален', description: `Товар "${productToDelete.name}" был успешно удален.` });
      setProductToDelete(null);
    }
  };

  const handleFormSubmit = (data: ProductFormValues) => {
    const productData = {
      ...data,
      size: stringToArray(data.size),
      availableSizes: stringToArray(data.availableSizes),
      price: Number(data.price)
    };

    if (productToEdit) {
      setProducts(prevProducts =>
        prevProducts.map(p => (p.id === productToEdit.id ? { ...p, ...productData, id: productToEdit.id } : p))
      );
      toast({ title: 'Товар обновлен', description: `Товар "${data.name}" был успешно обновлен.` });
    } else {
      const newProductWithId: Product = {
        ...productData,
        id: crypto.randomUUID(),
      };
      setProducts(prevProducts => [newProductWithId, ...prevProducts]);
      toast({ title: 'Товар добавлен', description: `Товар "${data.name}" был успешно добавлен.` });
    }
    setIsFormOpen(false);
    setProductToEdit(null);
  };

  const handleAddFilterSize = () => {
    if (newFilterSize.trim() === '' || newFilterSize.trim() === 'Все размеры') {
      toast({ title: 'Неверный размер', description: 'Пожалуйста, введите корректное название размера.', variant: 'destructive' });
      return;
    }
    if (managedFilterSizes.includes(newFilterSize.trim())) {
      toast({ title: 'Размер уже существует', description: `Размер "${newFilterSize.trim()}" уже есть в списке.`, variant: 'destructive' });
      return;
    }
    const updatedSizes = [...managedFilterSizes, newFilterSize.trim()];
    setManagedFilterSizes(updatedSizes);
    setGlobalFilterableSizes(updatedSizes);
    setNewFilterSize('');
    toast({ title: 'Размер добавлен', description: `Размер "${newFilterSize.trim()}" добавлен в фильтры.` });
  };

  const handleDeleteFilterSize = (sizeToDelete: string) => {
    if (sizeToDelete === 'Все размеры') {
      toast({ title: 'Действие запрещено', description: 'Размер "Все размеры" не может быть удален.', variant: 'destructive' });
      return;
    }
    const updatedSizes = managedFilterSizes.filter(size => size !== sizeToDelete);
    setManagedFilterSizes(updatedSizes);
    setGlobalFilterableSizes(updatedSizes);
    toast({ title: 'Размер удален', description: `Размер "${sizeToDelete}" удален из фильтров.` });
  };

  const handleAddAdminId = () => {
    const idToAdd = parseInt(newAdminIdInput, 10);
    if (isNaN(idToAdd) || idToAdd <= 0) {
      toast({ title: 'Неверный ID', description: 'Пожалуйста, введите корректный Telegram User ID (число).', variant: 'destructive' });
      return;
    }
    if (adminUserIds.includes(idToAdd)) {
      toast({ title: 'Администратор уже существует', description: `Пользователь с ID "${idToAdd}" уже является администратором.`, variant: 'destructive' });
      return;
    }
    if (addAdminId(idToAdd)) {
      setAdminUserIds(getAdminIds());
      setNewAdminIdInput('');
      toast({ title: 'Администратор добавлен', description: `Пользователь с ID "${idToAdd}" добавлен. Изменения вступят в силу при следующем входе.` });
    } else {
      toast({ title: 'Ошибка', description: 'Не удалось добавить администратора.', variant: 'destructive' });
    }
  };

  const handleRemoveAdminId = (idToRemove: number) => {
    if (adminUserIds.length <= 1 && adminUserIds.includes(idToRemove)) {
        toast({ title: 'Действие запрещено', description: 'Невозможно удалить единственного администратора.', variant: 'destructive' });
        return;
    }
    if (removeAdminId(idToRemove)) {
      setAdminUserIds(getAdminIds());
      toast({ title: 'Администратор удален', description: `Пользователь с ID "${idToRemove}" удален. Изменения вступят в силу при следующем входе.` });
    } else {
       toast({ title: 'Ошибка', description: 'Не удалось удалить администратора. Возможно, это последний администратор.', variant: 'destructive' });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const defaultFormValues = productToEdit
  ? {
      ...productToEdit,
      price: productToEdit.price, 
      size: arrayToString(productToEdit.size),
      availableSizes: arrayToString(productToEdit.availableSizes),
    }
  : undefined;


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Управление товарами</CardTitle>
          <Button onClick={handleAddProduct}>
            <PlusCircle className="mr-2 h-4 w-4" /> Добавить товар
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск по названию или бренду..."
                className="pl-8 w-full sm:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {filteredProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Бренд</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Image
                        src={product.imageUrl || 'https://placehold.co/64x64.png?text=N/A'}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                        data-ai-hint={product.dataAiHint || 'product image'}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>{product.price.toFixed(2)} ₽</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditProduct(product)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Редактировать</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteProduct(product)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Удалить</span>
                          </Button>
                        </AlertDialogTrigger>
                        {productToDelete && productToDelete.id === product.id && (
                           <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие не может быть отменено. Товар "{productToDelete?.name}" будет удален.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setProductToDelete(null)}>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {searchTerm ? 'Товары не найдены по вашему запросу.' : 'Товаров пока нет. Добавьте первый!'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Управление размерами для фильтрации</CardTitle>
          <CardDescription>Добавляйте или удаляйте размеры, доступные в фильтре товаров на главной странице. Изменения сохраняются в вашем браузере.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Новый размер (напр. XXL)"
              value={newFilterSize}
              onChange={(e) => setNewFilterSize(e.target.value.toUpperCase())}
              className="flex-grow"
            />
            <Button onClick={handleAddFilterSize}>
              <PlusCircle className="mr-2 h-4 w-4" /> Добавить размер
            </Button>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Текущие размеры в фильтре:</h4>
            {managedFilterSizes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {managedFilterSizes.map(size => (
                  <Badge key={size} variant={size === 'Все размеры' ? "default" : "secondary"} className="text-sm px-3 py-1">
                    {size}
                    {size !== 'Все размеры' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0 text-destructive hover:text-destructive/80"
                        onClick={() => handleDeleteFilterSize(size)}
                        aria-label={`Удалить размер ${size}`}
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    )}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Размеры для фильтрации не найдены.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Управление правами доступа администраторов
          </CardTitle>
          <CardDescription>Добавляйте или удаляйте Telegram User ID администраторов. Изменения сохраняются в вашем браузере. 
          Для вступления изменений в силу для других администраторов им может потребоваться перезайти в приложение.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Telegram User ID нового администратора"
              value={newAdminIdInput}
              onChange={(e) => setNewAdminIdInput(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleAddAdminId}>
              <UserPlus className="mr-2 h-4 w-4" /> Добавить
            </Button>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Текущие ID администраторов:</h4>
            {adminUserIds.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {adminUserIds.map(id => (
                  <Badge key={id} variant="secondary" className="text-sm px-3 py-1 tabular-nums">
                    {id}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1 h-4 w-4 p-0 text-destructive hover:text-destructive/80"
                      onClick={() => handleRemoveAdminId(id)}
                      aria-label={`Удалить администратора ${id}`}
                      disabled={adminUserIds.length <= 1 && adminUserIds.includes(id)}
                    >
                      <UserX className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Администраторы не найдены. Добавьте первого.</p>
            )}
             {adminUserIds.length <= 1 && adminUserIds.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">Невозможно удалить последнего администратора, чтобы сохранить доступ к панели.</p>
             )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setProductToEdit(null);
        }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{productToEdit ? 'Редактировать товар' : 'Добавить новый товар'}</DialogTitle>
            <DialogDescription>
              {productToEdit ? 'Внесите изменения в информацию о товаре.' : 'Заполните информацию о новом товаре.'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setProductToEdit(null);
            }}
            initialData={defaultFormValues}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
