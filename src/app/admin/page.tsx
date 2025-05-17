
import { getStoreSettings } from '@/lib/data';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StoreManagementForm } from '@/components/admin/StoreManagementForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const storeSettings = await getStoreSettings();

  return (
    <>
      <AdminPageHeader 
        title="Панель управления"
        description="Обзор и управление вашим магазином."
      />
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <StoreManagementForm settings={storeSettings} />
        
        <Card>
            <CardHeader>
                <CardTitle>Добро пожаловать!</CardTitle>
                <CardDescription>Это главная страница вашей админ-панели.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Используйте навигацию слева для управления товарами, фильтрами и другими настройками магазина.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}

export const dynamic = 'force-dynamic';
