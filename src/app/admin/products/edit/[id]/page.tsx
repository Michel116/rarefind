
import { getProductById, getBrands, getSizes } from '@/lib/data';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ProductForm } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const product = await getProductById(params.id);
  const brands = await getBrands();
  const availableSizes = await getSizes();

  if (!product) {
    notFound();
  }

  return (
    <>
      <AdminPageHeader
        title={`Редактировать: ${product.name}`}
        description="Обновите информацию о товаре."
      />
      <ProductForm 
        product={product} 
        brands={brands} 
        availableSizes={availableSizes} 
      />
    </>
  );
}

export const dynamic = 'force-dynamic';
