"use client";

import { useTelegram } from '@/contexts/TelegramContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle, AtSign, Smartphone } from 'lucide-react';

export function UserProfile() {
  const { user, isInitializing } = useTelegram();

  if (isInitializing) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl">Мой Профиль</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl">Мой Профиль</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Информация о пользователе недоступна. Убедитесь, что вы заходите в приложение через Telegram.</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + last || 'П'; // Russian for User 'Пользователь'
  };

  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl">Мой Профиль</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-24 w-24 border-2 border-primary">
            <AvatarImage src={user.photoUrl} alt={`${user.firstName} ${user.lastName || ''}`} data-ai-hint="profile picture" />
            <AvatarFallback className="text-3xl bg-muted">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold text-primary">
              {user.firstName} {user.lastName || ''}
            </h2>
            {user.username && (
              <p className="text-md text-muted-foreground flex items-center gap-1">
                <AtSign className="h-4 w-4" /> @{user.username}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
            <UserCircle className="h-5 w-5 text-primary" />
            <span className="text-sm"><strong>ID:</strong> {user.id}</span>
          </div>
          {/* In a real app, you might have more fields like email, phone, address if collected */}
          {/* For now, we only have what Telegram provides by default */}
          {/* <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
            <Smartphone className="h-5 w-5 text-primary" />
            <span className="text-sm"><strong>Телефон:</strong> (Недоступно через SDK напрямую)</span>
          </div> */}
        </div>

        {/* Placeholder for profile actions */}
        {/* <div className="mt-6">
          <Button variant="outline">Редактировать профиль</Button>
        </div> */}
      </CardContent>
    </Card>
  );
}
