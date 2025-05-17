
import { getMockUser, getOrderHistory } from "@/lib/data";
import type { User, Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { OrderHistoryTable } from "@/components/profile/OrderHistoryTable";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, LogIn } from "lucide-react";
import { SiteConfigData } from "@/config/site";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

// Mock current user ID. In a real app, this would come from an auth session.
const MOCK_USER_ID = 'user123';

export default async function ProfilePage() {
  const user = await getMockUser(MOCK_USER_ID);
  const orders = await getOrderHistory(MOCK_USER_ID);

  if (!user) {
    // This state should ideally be handled by authentication middleware redirecting to a login page.
    // For now, display a message.
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Alert className="max-w-md text-center">
          <LogIn className="h-5 w-5 mx-auto mb-2" />
          <AlertTitle className="text-xl font-semibold">Требуется авторизация</AlertTitle>
          <AlertDescription className="mt-2">
            Пожалуйста, войдите в систему, чтобы просмотреть свой профиль.
            <Button asChild className="mt-4">
              <Link href="/">На главную</Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              (В реальном приложении здесь была бы кнопка входа через Telegram)
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col items-center sm:flex-row sm:items-start gap-4 bg-muted/30 p-6">
          <Avatar className="h-20 w-20 border-2 border-primary">
            {/* Placeholder for user avatar, can be a Telegram profile picture */}
            <AvatarFallback>
              <UserIcon className="h-10 w-10" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            {user.email && <CardDescription>{user.email}</CardDescription>}
            {user.telegramId && <CardDescription>Telegram: @{user.telegramId}</CardDescription>}
             <Button variant="outline" size="sm" className="mt-3">
              <LogIn className="mr-2 h-4 w-4" /> Войти через Telegram (заглушка)
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Полная авторизация через Telegram требует серверной интеграции.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
           <p className="text-sm text-muted-foreground">
            Добро пожаловать в ваш личный кабинет! Здесь вы можете просмотреть историю своих заказов.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">История заказов</h2>
        <Separator className="mb-6" />
        {orders.length > 0 ? (
          <OrderHistoryTable orders={orders} currency={SiteConfigData.currency} />
        ) : (
          <p className="text-muted-foreground">У вас еще нет заказов.</p>
        )}
      </div>
    </div>
  );
}
