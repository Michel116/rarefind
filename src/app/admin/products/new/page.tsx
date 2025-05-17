
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { getBrands, getSizes } from '@/lib/data';

export default async function NewProductPage() {
  const brands = await getBrands();
  const sizes = await getSizes();

  return (
    <>
      <AdminPageHeader
        title="Добавить новый товар"
        description="Заполните информацию о новом товаре."
      />
      <ProductForm brands={brands} availableSizes={sizes} />
    </>
  );
}

export const dynamic = 'force-dynamic';
