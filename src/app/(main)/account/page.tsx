import { UserProfile } from '@/components/account/UserProfile';
import { OrderHistory } from '@/components/account/OrderHistory';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Мой Аккаунт</h1>
        <p className="text-muted-foreground">Управляйте своим профилем и просматривайте историю заказов.</p>
      </div>
      <UserProfile />
      <Separator />
      <OrderHistory />
    </div>
  );
}
