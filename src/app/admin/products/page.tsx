
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getBrandNameById } from '@/lib/data';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { deleteProduct } from '@/lib/actions';
import { SiteConfigData } from '@/config/site';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <>
      <AdminPageHeader 
        title="Товары"
        description="Управление каталогом товаров вашего магазина."
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Добавить товар
            </Link>
          </Button>
        }
      />
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">Изображение</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead className="hidden md:table-cell">Цена</TableHead>
              <TableHead className="hidden md:table-cell">Скидка</TableHead>
              <TableHead className="hidden md:table-cell">Размеры</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image || "https://placehold.co/64x64.png"}
                    width="64"
                    data-ai-hint="product photo"
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{getBrandNameById(product.brandId)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.price.toLocaleString('ru-RU')} {SiteConfigData.currency}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.discount ? `${product.discount}%` : '-'}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {product.sizes.map(s => s.toUpperCase()).join(', ')}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Открыть меню</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/products/edit/${product.id}`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Редактировать
                        </Link>
                      </DropdownMenuItem>
                      <DeleteConfirmationDialog
                        itemName={product.name}
                        onConfirm={deleteProduct.bind(null, product.id)}
                      >
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive px-2 py-1.5 text-sm h-auto font-normal cursor-pointer">
                           <Trash2 className="mr-2 h-4 w-4" /> Удалить
                        </Button>
                      </DeleteConfirmationDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Товары еще не добавлены.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';

