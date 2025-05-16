
'use client';

import { useState, useEffect } from 'react';
import { getAdminIds } from '@/lib/adminAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserList } from 'lucide-react';

export default function AdminUsersPage() {
  const [adminUserIds, setAdminUserIds] = useState<number[]>([]);

  useEffect(() => {
    setAdminUserIds(getAdminIds());
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserList className="h-6 w-6 text-primary" />
            Список администраторов
          </CardTitle>
          <CardDescription>
            Ниже приведен список Telegram User ID пользователей, имеющих доступ к админ-панели.
            Управление этим списком (добавление и удаление администраторов) осуществляется на странице "Управление товарами".
          </CardDescription>
        </CardHeader>
        <CardContent>
          {adminUserIds.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Telegram User ID</TableHead>
                  {/* Можно добавить столбец "Дата добавления", если эта информация будет храниться */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUserIds.map(id => (
                  <TableRow key={id}>
                    <TableCell className="font-medium tabular-nums">{id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              Список администраторов пуст. Вы можете добавить первого администратора на странице "Управление товарами".
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
