
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterManagementTable } from "@/components/admin/FilterManagementTable";
import { getBrands, getSizes } from "@/lib/data";
import type { Brand, Size } from "@/lib/types";

export default async function AdminFiltersPage() {
  const brands = await getBrands();
  const sizes = await getSizes();

  return (
    <>
      <AdminPageHeader 
        title="Фильтры"
        description="Управление брендами и размерами товаров."
      />
      <Tabs defaultValue="brands" className="w-full">
        <div className="flex justify-center mb-4">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="brands">Бренды</TabsTrigger>
            <TabsTrigger value="sizes">Размеры</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="brands">
          <FilterManagementTable<Brand>
            items={brands}
            itemType="brand"
            columns={[
              { accessorKey: 'name', header: 'Название бренда' },
            ]}
            dialogTitle="бренд"
            dialogFields={[{ name: 'name', label: 'Название бренда', type: 'text', placeholder: 'Например, Nike' }]}
          />
        </TabsContent>
        <TabsContent value="sizes">
          <FilterManagementTable<Size>
            items={sizes}
            itemType="size"
            columns={[
              { accessorKey: 'name', header: 'Название размера' },
            ]}
            dialogTitle="размер"
            dialogFields={[{ name: 'name', label: 'Название размера', type: 'text', placeholder: 'Например, S, M, L, 42, One Size' }]}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

export const dynamic = 'force-dynamic';
